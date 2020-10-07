﻿using Microsoft.AspNetCore.Hosting;
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
        private Graph loadFromUriXml(String uri) {
            Graph g = new Graph();
            UriLoader.Load(g, new Uri(uri), new RdfXmlParser());
            return g;
        }

        // Load RDF content from ttl file
        private Graph loadFromFileTurtle(String fileName) {
            Graph g = new Graph();
            TurtleParser ttlParser = new TurtleParser();
            ttlParser.Load(g, fileName);
            return g;
        }
        // Load RDF content from xml file 
        private Graph loadFromFileXml(String fileName) {
            Graph g = new Graph();
            RdfXmlParser xmlParser = new RdfXmlParser();
            xmlParser.Load(g, fileName);
            return g;
        }

        // Save RDF content to file as turtle
        private void saveToFileTurtle(Graph g, String fileName) {
            CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            turtleWriter.Save(g, fileName);
        }

        // Parse graph to string on turtle format
        private String graphToStringTurtle(Graph g) {
            CompressingTurtleWriter turtleWriter = new CompressingTurtleWriter();
            return VDS.RDF.Writing.StringWriter.Write(g, turtleWriter);
        }
        // Parse string on turtle format to graph
        private Graph stringToGraphTurtle(String s) {
            Graph g = new Graph();
            StringParser.Parse(g, s, new TurtleParser());
            return g;
        }
        // Load RDF content from URI with headers corresponding to turtle
        private Graph loadFromUriWithHeadersTurtle(String uri) {
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
        private Dictionary<string,string> getAttributesFromSubject(Graph g, String subject){
            Console.WriteLine("---------------------------");
            Console.WriteLine(subject);
            IUriNode node = g.CreateUriNode(new Uri(subject));
            Dictionary<string,string> attributes = new Dictionary<string, string>();
            IEnumerable<Triple> triples = g.GetTriplesWithSubject(node);
            foreach (Triple t in triples){
                string p = t.Predicate.ToString();
                int slash = p.LastIndexOf("/");
                int hash = p.LastIndexOf("#");
                int index = Math.Max(slash,hash) + 1;
                p = p.Substring(index);
                attributes[p] = t.Object.ToString();
            }
            return attributes;
        }
        // Find the subject uri for a chosen object uriNode using the predicate rdf:type
        private String findSubjectUri(Graph g, IUriNode uriNode){
            IUriNode rdfType = g.CreateUriNode("rdf:type");
            String uri = "";
            IEnumerable<Triple> ts = g.GetTriplesWithPredicateObject(rdfType, uriNode);
            foreach (Triple t in ts) {
                uri = t.Subject.ToString();
            }
            return uri;
        }

        // Add a dataset in a graph to the database
        private async Task<Dataset> addDataset(Graph g) {
            // Find publisher id
            Publisher publisher = await addPublisher(g);

            // Find the dataset subject uri 
            IUriNode dcatDataset = g.CreateUriNode("dcat:Dataset");
            String datasetUri = findSubjectUri(g, dcatDataset);
            // From the dataset uri make a dictionary with the attributes
            Dictionary<string,string> attributes = getAttributesFromSubject(g, datasetUri);
            // Add relevant attributes to a new dataset
            Dataset dataset = new Dataset {
                Title = attributes.GetValueOrDefault("title", "Ingen tittel"), 
                Identifier = datasetUri, 
                Description = attributes.GetValueOrDefault("description", ""), 
                PublicationStatus = attributes.ContainsKey("distribution") ? EPublicationStatus.published : EPublicationStatus.notPublished,
                PublisherId = publisher.Id, 
                CategoryId = 100 
            };

            // Add the dataset to the database
            await _datasetRepository.AddAsync(dataset);
            await _unitOfWork.CompleteAsync();
            
            await addDistribution(g, dataset.Id);
            return dataset;
        }

        // Add a distribution in a graph to the database
        private async Task<Distribution> addDistribution(Graph g, int datasetId){
            // Find the distribution subject uri 
            IUriNode dcatDistribution = g.CreateUriNode("dcat:Distribution");
            String distributionUri = findSubjectUri(g, dcatDistribution);

            Dictionary<string,string> attributes = getAttributesFromSubject(g, distributionUri);

            //Parse file format
            EFileFormat fileFormat = EFileFormat.annet;
            try {
                fileFormat = (EFileFormat)Enum.Parse(typeof(EFileFormat), attributes.GetValueOrDefault("format", "annet"), true);
            }catch(Exception ex){Console.WriteLine(ex.Message);}

            // Add relevant attributes to a new distribution
            Distribution distribution = new Distribution {
                Title = attributes.GetValueOrDefault("title", ""), 
                Uri = attributes.GetValueOrDefault("accessURL", ""), 
                FileFormat = fileFormat, 
                DatasetId = datasetId
            };

            // Add the dataset to the distribution
            await _distributionRepository.AddAsync(distribution);
            await _unitOfWork.CompleteAsync();
            return distribution;
        }

        // Add a publisher in a graph to the database
        private async Task<Publisher> addPublisher(Graph g){
            // Find the publisher subject uri 
            IUriNode foafOrganization = g.CreateUriNode("foaf:Organization");
            String publisherUri = findSubjectUri(g, foafOrganization);
            if (String.IsNullOrWhiteSpace(publisherUri)){
                IUriNode foafAgent = g.CreateUriNode("foaf:Agent");
                publisherUri = findSubjectUri(g, foafAgent);
            }
            
            Dictionary<string,string> attributes = getAttributesFromSubject(g, publisherUri);
            String publisherName = attributes.GetValueOrDefault("name", "Ukjent");
            
            // Check if the publisher  already exists
            IEnumerable<Publisher> existingPublishers = await _publisherRepository.ListAsync();
            foreach (Publisher pub in existingPublishers){
                if (pub.Name.ToLower().Equals(publisherName.ToLower())){
                    return pub;
                }
            }

            // If it doesn't exist, add relevant attributes to a new publisher
            Publisher publisher = new Publisher {
                Name = attributes.GetValueOrDefault("name", "Ukjent"), 
            };

            // Add the dataset to the publisher
            await _publisherRepository.AddAsync(publisher);
            await _unitOfWork.CompleteAsync();
            return publisher;
        }

        
        public async Task<Dataset> import()
        {   
            Console.WriteLine("KJØRER ==========================");
            
            Graph g = loadFromUriWithHeadersTurtle("https://fellesdatakatalog.digdir.no/api/datasets/e26c5150-7f66-4b0e-a086-27c10f42800f");
            // Graph g = loadFromUriWithHeadersTurtle("https://fellesdatakatalog.digdir.no/api/datasets/4a058e46-99f0-4e70-903a-e17736ae3e85");
            
            // Graph g = loadFromUriXml("https://opencom.no/dataset/58f23dea-ab22-4c68-8c3b-1f602ded6d3e.rdf");


            Dataset dataset = await addDataset(g);

            Console.WriteLine("STOPPER ==========================");
            return dataset;
        }

        public void export() {
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