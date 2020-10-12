﻿﻿using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenData.API.Persistence.Contexts;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Repositories;
using System;
using System.Collections.Generic;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace OpenData.API.Services
{

#pragma warning disable CS1591
    public class RdfService : IRdfService
    {
        
        private readonly IDatasetRepository _datasetRepository;
        private readonly IDistributionRepository _distributionRepository;
        private readonly IPublisherRepository _publisherRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ITagsRepository _tagsRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RdfService(IDatasetRepository datasetRepository, IDistributionRepository distributionRepository, IPublisherRepository publisherRepository, ICategoryRepository categoryRepository, ITagsRepository tagsRepository, IUnitOfWork unitOfWork)
        {
            _datasetRepository = datasetRepository;
            _distributionRepository = distributionRepository;
            _publisherRepository = publisherRepository;
            _categoryRepository = categoryRepository;
            _tagsRepository = tagsRepository;
            _unitOfWork = unitOfWork;
        }

        // Load RDF content from URI
        private Graph loadFromUriXml(String uri) 
        {
            Graph g = new Graph();
            UriLoader.Load(g, new Uri(uri), new RdfXmlParser());
            return g;
        }

        // Load RDF content from ttl file
        private Graph loadFromFileTurtle(String fileName) 
        {
            Graph g = new Graph();
            TurtleParser ttlParser = new TurtleParser();
            ttlParser.Load(g, fileName);
            return g;
        }
        // Load RDF content from xml file 
        private Graph loadFromFileXml(String fileName) 
        {
            Graph g = new Graph();
            RdfXmlParser xmlParser = new RdfXmlParser();
            xmlParser.Load(g, fileName);
            return g;
        }

        // Save RDF content to file as turtle
        private void saveToFileTurtle(Graph g, String fileName) 
        {
            CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            turtleWriter.CompressionLevel = 1;
            turtleWriter.Save(g, fileName);
        }

        // Parse graph to string on turtle format
        private String graphToStringTurtle(Graph g) 
        {
            CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            return VDS.RDF.Writing.StringWriter.Write(g, turtleWriter);
        }
        // Parse graph to string on xml format
        private String graphToStringXml(Graph g) 
        {
            RdfXmlWriter xmlWriter = new RdfXmlWriter();
            return VDS.RDF.Writing.StringWriter.Write(g, xmlWriter);
        }
        // Parse string on turtle format to graph
        private Graph stringToGraphTurtle(String s) 
        {
            Graph g = new Graph();
            StringParser.Parse(g, s, new TurtleParser());
            return g;
        }
        // Parse string on xml format to graph
        private Graph stringToGraphXml(String s) 
        {
            Graph g = new Graph();
            StringParser.Parse(g, s, new RdfXmlParser());
            return g;
        }

        // Load RDF content from URI with headers corresponding to turtle
        private Graph loadFromUriWithHeadersTurtle(String uri) 
        {
            System.Net.WebRequest req = System.Net.WebRequest.Create(uri);
            // Sets headers to turtle format
            req.Headers["Accept"] = "text/turtle";
            // Sends request and recieves response
            System.Net.WebResponse resp = req.GetResponse();
            // Converts response to string
            System.IO.StreamReader sr = new System.IO.StreamReader(resp.GetResponseStream());
            string result = sr.ReadToEnd().Trim();
            // Parses string to graph
            Graph g = stringToGraphTurtle(result);
            return g;
        }

        // Get attributes as dictionary from chosen subject node
        private Dictionary<string,string> getAttributesFromSubject(Graph g, String subject)
        {
            Dictionary<string,string> attributes = new Dictionary<string, string>();
            IEnumerable<Triple> triples = g.Triples;
            foreach (Triple t in triples){
                if (t.Subject.ToString() == subject)
                {
                    string p = t.Predicate.ToString();
                    int slash = p.LastIndexOf("/");
                    int hash = p.LastIndexOf("#");
                    int index = Math.Max(slash,hash) + 1;
                    p = p.Substring(index);
                    if(attributes.ContainsKey(p))
                    {
                        attributes[p] = attributes[p] + "," + t.Object.ToString();
                    }
                    else
                    {
                        attributes[p] = t.Object.ToString();
                    }
                }
            }
            return attributes;
        }
        // Find the subject uri for a chosen object uriNode using the predicate rdf:type
        private String findSubjectUri(Graph g, IUriNode uriNode)
        {
            IUriNode rdfType = g.CreateUriNode("rdf:type");
            String uri = "";
            IEnumerable<Triple> ts = g.GetTriplesWithPredicateObject(rdfType, uriNode);
            foreach (Triple t in ts) {
                if (String.IsNullOrEmpty(uri))
                {
                    uri = t.Subject.ToString();
                }
                else 
                {
                    uri += "," + t.Subject.ToString();
                }
            }
            return uri;
        }

        // Add a dataset in a graph to the database
        private async Task<Dataset> addDataset(Graph g) 
        {
            // Find publisher id
            Publisher publisher = await addPublisher(g);

            // Find the dataset subject uri 
            IUriNode dcatDataset = g.CreateUriNode("dcat:Dataset");
            String[] datasetUri = findSubjectUri(g, dcatDataset).Split(",");
            // From the dataset uri make a dictionary with the attributes
            Dictionary<string,string> attributes = getAttributesFromSubject(g, datasetUri[0]);
            // Add relevant attributes to a new dataset
            Dataset dataset = new Dataset {
                Title = attributes.GetValueOrDefault("title", "Ingen tittel"), 
                Identifier = datasetUri[0], 
                Description = attributes.GetValueOrDefault("description", ""), 
                PublicationStatus = attributes.ContainsKey("distribution") ? EPublicationStatus.published : EPublicationStatus.notPublished,
                PublisherId = publisher.Id, 
                CategoryId = 100 
            };

            // Add the dataset to the database
            await _datasetRepository.AddAsync(dataset);
            await _unitOfWork.CompleteAsync();
            
            addTags(g, attributes.GetValueOrDefault("keyword", ""), dataset);
            await addDistribution(g, dataset.Id);
            return dataset;
        }

        private async void addTags(Graph g, String keywords, Dataset dataset)
        {
            String[] keywordsList = keywords.Split(",");
            IEnumerable<Tags> existingTags = await _tagsRepository.ListAsync();
            foreach (String keyword in keywordsList)
            {
                Tags existingTag = null;
                foreach (Tags tag in existingTags) 
                {
                    if (tag.Name.ToLower().Equals(keyword.ToLower()))
                    {
                        existingTag = tag;
                        break;
                    }
                }
                if (existingTag != null) 
                {
                    DatasetTags datasetTag = new DatasetTags { Dataset = dataset, Tags = existingTag };
                    dataset.DatasetTags.Add(datasetTag);
                }
                else 
                {
                    Tags tag = new Tags { Name = keyword };
                    await _tagsRepository.AddAsync(tag);
                    await _unitOfWork.CompleteAsync();
                    DatasetTags datasetTag = new DatasetTags { Dataset = dataset, Tags = tag };
                    dataset.DatasetTags.Add(datasetTag);
                    await _unitOfWork.CompleteAsync();
                }
            }
        }

        // Add a distribution in a graph to the database
        private async Task<List<Distribution>> addDistribution(Graph g, int datasetId)
        {
            // Find the distribution subject uri 
            IUriNode dcatDistribution = g.CreateUriNode("dcat:Distribution");
            String[] distributionUris = findSubjectUri(g, dcatDistribution).Split(",");
            List<Distribution> distributions = new List<Distribution>();
            foreach (String distributionUri in distributionUris)
            {
                Dictionary<string,string> attributes = getAttributesFromSubject(g, distributionUri);
                //Parse file format
                EFileFormat fileFormat = EFileFormat.annet;
                String[] fileFormatString = attributes.GetValueOrDefault("format", "annet").Split(",");
                try 
                {
                    fileFormat = (EFileFormat)Enum.Parse(typeof(EFileFormat), fileFormatString[0], true);
                }
                catch(Exception ex){Console.WriteLine(ex.Message);}

                // Add relevant attributes to a new distribution
                Distribution distribution = new Distribution {
                    Title = (string) attributes.GetValueOrDefault("title", attributes.GetValueOrDefault("description", "")), 
                    Uri = (string) attributes.GetValueOrDefault("accessURL", ""), 
                    FileFormat = fileFormat, 
                    DatasetId = datasetId
                };

                // Add the dataset to the distribution
                await _distributionRepository.AddAsync(distribution);
                await _unitOfWork.CompleteAsync();
                distributions.Add(distribution);
            }
            return distributions;
        }

        // Add a publisher in a graph to the database
        private async Task<Publisher> addPublisher(Graph g)
        {
            // Find the publisher subject uri 
            IUriNode foafOrganization = g.CreateUriNode("foaf:Organization");
            String[] publisherUri = findSubjectUri(g, foafOrganization).Split(",");
            if (String.IsNullOrWhiteSpace(publisherUri[0]))
            {
                IUriNode foafAgent = g.CreateUriNode("foaf:Agent");
                publisherUri = findSubjectUri(g, foafAgent).Split(",");
            }
            
            Dictionary<string,string> attributes = getAttributesFromSubject(g, publisherUri[0]);
            String publisherName = attributes.GetValueOrDefault("name", "Ukjent");
            
            // Check if the publisher  already exists
            IEnumerable<Publisher> existingPublishers = await _publisherRepository.ListAsync();
            foreach (Publisher pub in existingPublishers)
            {
                if (pub.Name.ToLower().Equals(publisherName.ToLower()))
                {
                    return pub;
                }
            }

            // If it doesn't exist, add relevant attributes to a new publisher
            Publisher publisher = new Publisher {
                Name = publisherName, 
            };

            // Add the dataset to the publisher
            await _publisherRepository.AddAsync(publisher);
            await _unitOfWork.CompleteAsync();
            return publisher;
        }

        // TODO: De fra data.norge.no har flere format på en distribution?? Skal vi støtte det? :o
        // RART: Finner ikke kategori kobling i rdfene
        // Import dataset from link containing rdf schema. 
        public async Task<Dataset> import(String url)
        {   
            Graph g;
            // Guess the url is actually an url.
            if (url.Contains("/"))
            {   
                // If it is in fellesdatakatalog API we need to request with headers to get on rdf format
                if (url.Contains("fellesdatakatalog.digdir.no"))
                {
                    g = loadFromUriWithHeadersTurtle(url);
                }
                // If the url is directly to the page on data.norge.no fetch with the id
                else if (url.Contains("data.norge.no")){
                    g = loadFromUriWithHeadersTurtle("https://fellesdatakatalog.digdir.no/api/datasets/" + url.Substring(url.LastIndexOf("/")+1));
                }
                // Otherwise hope the url is directly to a rdf file location on XML format
                else 
                {
                    g = loadFromUriXml(url);
                }
            }
            // Guess it is not an url, and instead ID to some dataset in data.norge.no
            else 
            {
                g = loadFromUriWithHeadersTurtle("https://fellesdatakatalog.digdir.no/api/datasets/" + url);
            }

            // Try to parse the dataset and save it in the database
            Dataset dataset = await addDataset(g);

            // saveToFileTurtle(g, "dcat_example2.ttl");

            return dataset;
        }

        // "https://fellesdatakatalog.digdir.no/api/datasets/e26c5150-7f66-4b0e-a086-27c10f42800f",
        // "https://opencom.no/dataset/58f23dea-ab22-4c68-8c3b-1f602ded6d3e.rdf",
        // Populate the database with datasets from fellesdatakatalog
        public async Task<Dataset> populate(int numberOfDatasets) 
        {
            List<string> urls = findUrlsFromFellesKatalogen(numberOfDatasets);
            Dataset dataset = new Dataset();
            foreach (string url in urls)
            {
                // A small part of the datasets in the fellesdatakatalog does not have a rdf version
                try 
                {
                    dataset = await import(url);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            return dataset;
        }

        public static int numberOfAddedDatasets = 0;
        // Find urls from felleskatalogen with search on "kommune"
        private List<string> findUrlsFromFellesKatalogen(int numberOfDatasets)   
        {
            List<string> urls = new List<string>();

            int startIndex = (int)(Math.Floor((double)numberOfAddedDatasets/10));
            Console.WriteLine(startIndex);
            int stopIndex = startIndex + (int)(Math.Ceiling((double)numberOfDatasets/10)) + 1;
            Console.WriteLine(stopIndex);
            int offset = numberOfAddedDatasets % 10;
            Console.WriteLine(offset);

            JArray hits = new JArray();
            for (int i = startIndex; i < stopIndex; i++)
            {
                JArray newHits = loadFromUrlAsJson("https://fellesdatakatalog.digdir.no/api/datasets?q=kommune&page=" + i.ToString());
                foreach (JObject dataset in newHits)
                {
                    hits.Add(dataset);
                }
            }
            // foreach (JObject dataset in hits)
            for (int i = offset; i < Math.Min(numberOfDatasets + offset, hits.Count); i++)
            {
                urls.Add("https://fellesdatakatalog.digdir.no/api/datasets/" + (string) hits[i]["_id"]);
                numberOfAddedDatasets++;
            }
            
            return urls;
        }      

        // Fetch from a URL as JSON and return hits
        private JArray loadFromUrlAsJson(String uri) 
        {
            System.Net.WebRequest req = System.Net.WebRequest.Create(uri);
            req.Headers["Accept"] = "application/json";
            // Sends request and recieves response
            System.Net.WebResponse resp = req.GetResponse();
            // Converts response to string
            System.IO.StreamReader sr = new System.IO.StreamReader(resp.GetResponseStream());
            string result = sr.ReadToEnd().Trim();

            JObject joResponse = JObject.Parse(result);  
            JObject joObject = (JObject)joResponse["hits"];
            return (JArray)joObject["hits"];
        }

        public void export() 
        {
            // (in Turtle "a" is a shortcut for the rdf:type predicate)
            // IUriNode rdfType = g.CreateUriNode("rdf:type");
            // IUriNode catalog = g.CreateUriNode(UriFactory.Create("https://www.opendata.no/catalog"));
            // IUriNode dctIdentifier = g.GetUriNode("dct:identifier");
            // IUriNode dcatCatalog = g.GetUriNode("dcat:Catalog");

            // IUriNode dctTitle = g.GetUriNode("dct:title");
            // ILiteralNode catalogTitle = g.CreateLiteralNode("OpenData");

            // IUriNode dctDescription = g.GetUriNode("dct:description");
            // ILiteralNode catalogDescription = g.CreateLiteralNode("OpenData is a data catalog containing open data from municipalities in Norway. Both published and not yet published.");
            
            // g.Assert(new Triple(catalog, dctIdentifier, dcatCatalog));
            // g.Assert(new Triple(catalog, dctTitle, catalogTitle));
            // g.Assert(new Triple(catalog, dctDescription, catalogDescription));


            // IUriNode trondheim = g.CreateUriNode(UriFactory.Create("https://www.opendata.no/agent/trondheim"));
            // IUriNode foafAgent = g.GetUriNode("foaf:Agent");
            // IUriNode foafName = g.GetUriNode("foaf:name");
            // ILiteralNode trondheimName = g.CreateLiteralNode("Trondheim kommune");

            // g.Assert(new Triple(trondheim, dctIdentifier, foafAgent));
            // g.Assert(new Triple(trondheim, foafName, trondheimName));
            
            // IUriNode dctPublisher = g.GetUriNode("dct:publisher");
            // g.Assert(new Triple(catalog, dctPublisher, trondheim));
        }

    }
#pragma warning restore CS1591
}