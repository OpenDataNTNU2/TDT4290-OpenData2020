using System;
using VDS.RDF;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Repositories;
using System.Collections.Generic;
using System.Linq;
using OpenData.API.Util;
using OpenData.API.Domain.Services.Communication;


namespace OpenData.API.Services
{
    public class GraphService : IGraphService
    {
        private readonly IDatasetRepository _datasetRepository;
        private readonly IDistributionRepository _distributionRepository;
        private readonly IPublisherRepository _publisherRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ITagsRepository _tagsRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDatasetService _datasetService;

        public GraphService(IDatasetRepository datasetRepository, IDatasetService datasetService, IDistributionRepository distributionRepository, IPublisherRepository publisherRepository, ICategoryRepository categoryRepository, ITagsRepository tagsRepository, IUnitOfWork unitOfWork)
        {
            _datasetRepository = datasetRepository;
            _distributionRepository = distributionRepository;
            _publisherRepository = publisherRepository;
            _categoryRepository = categoryRepository;
            _tagsRepository = tagsRepository;
            _unitOfWork = unitOfWork;
            _datasetService = datasetService;
        }

        // Add a dataset in a graph to the database
        public async Task<DatasetResponse> AddDataset(Graph g, int categoryId) 
        {
            // Find publisher id
            Publisher publisher = await AddPublisher(g);
            await _unitOfWork.CompleteAsync();

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
                CategoryId = categoryId,
                DatePublished = getDateOrNow(attributes.GetValueOrDefault("issued", "")),  
                DateLastUpdated = getDateOrNow(attributes.GetValueOrDefault("modified", "")),  
                AccessLevel = EAccessLevel.green,  
            };

            var createDatasetTask = Task.Run(async() => {
                // Add the dataset to the database
                dataset = await _datasetRepository.AddAsync(dataset);
                await _unitOfWork.CompleteAsync();
                
                await AddTags(g, attributes.GetValueOrDefault("keyword", ""), dataset);
                await AddDistribution(g, dataset.Id);
                return dataset;
            });
            return await _datasetService.CreateGitLabProject(createDatasetTask, dataset);
        }

        private DateTime getDateOrNow(String stringDate)
        {
            if (String.IsNullOrEmpty(stringDate)){
                return DateTime.Now;
            }
            return DateTime.Parse(stringDate.Substring(0,stringDate.IndexOf("^")));
        }

        // Add a distribution in a graph to the database
        public async Task<List<Distribution>> AddDistribution(Graph g, int datasetId)
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
        public async Task<Publisher> AddPublisher(Graph g)
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
            
            // Check if the publisher already exists
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
                Name = FirstCharToUpper(publisherName), 
            };

            // Add the dataset to the publisher
            await _publisherRepository.AddAsync(publisher);
            await _unitOfWork.CompleteAsync();
            return publisher;
        }

        public static string FirstCharToUpper(string input)
        {
            if (String.IsNullOrEmpty(input))
                throw new ArgumentException("Input value null or empty!");
            return input.First().ToString().ToUpper() + input.Substring(1).ToLower();
        }

        // Add tags in a graph to the database
        public async Task AddTags(Graph g, String keywords, Dataset dataset)
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

        // Add concept scheme in a graph to the database
        public async Task<Boolean> AddConceptScheme(Graph g)
        {
            
            IUriNode dcatDataset = g.CreateUriNode("skos:ConceptScheme");
            String[] datasetUri = findSubjectUri(g, dcatDataset).Split(",");
            // From the dataset uri make a dictionary with the attributes
            Dictionary<string,string> attributes = getAttributesFromSubject(g, datasetUri[0]);

            String[] topConceptUrls = attributes.GetValueOrDefault("hasTopConcept", "").Split(",");

            foreach (String topConceptUrl in topConceptUrls){
                await AddCategory(NetworkHandling.LoadFromUriXml(topConceptUrl), null);
            }
            return true;
        }


        // Add category and childrens in a graph to the database
        public async Task<Boolean> AddCategory(Graph g, Category broader)
        {

            IUriNode dcatDataset = g.CreateUriNode("skos:Concept");
            String[] datasetUri = findSubjectUri(g, dcatDataset).Split(",");
            // From the dataset uri make a dictionary with the attributes
            Dictionary<string,string> attributes = getAttributesFromSubject(g, datasetUri[0]);

            String[] prefLabels = attributes.GetValueOrDefault("prefLabel", "").Split(",");
            
            Category category = new Category {
                Name = prefLabels[0],
                Broader = broader
            };

            await _categoryRepository.AddAsync(category);
            await _unitOfWork.CompleteAsync();

            String[] narrowerUrls = attributes.GetValueOrDefault("narrower", "").Split(",");
            foreach(String url in narrowerUrls)
            {
                if (!String.IsNullOrEmpty(url)){
                    await AddCategory(NetworkHandling.LoadFromUriXml(url), category);
                }
            }
            return true;
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
                    // TODO: This should probably be handled differently, see rAt function
                    if (rAt(t.Object.ToString()) == "") continue;
                    if(attributes.ContainsKey(p))
                    {
                        attributes[p] = attributes[p] + "," + rAt(t.Object.ToString());
                    }
                    else
                    {
                        attributes[p] = rAt(t.Object.ToString());
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


        // TODO: This should probably be handled differently
        // Just removing @nn and @en here.
        private String rAt(String s)
        {
            if (s.Contains("@"))
            {
                if (s.Contains("@nb"))
                {
                    return s.Substring(0,s.LastIndexOf("@"));
                }
                else {
                    return "";
                }
            }
            return s;
        }
    }
}