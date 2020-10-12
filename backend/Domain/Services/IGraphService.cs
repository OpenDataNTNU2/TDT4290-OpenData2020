using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using System.Collections.Generic;
using System;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;

namespace OpenData.API.Domain.Services
{
    public interface IGraphService
    {
        Task<Dataset> AddDataset(Graph g);
        Task<List<Distribution>> AddDistribution(Graph g, int datasetId);
        Task<Publisher> AddPublisher(Graph g);
        void AddTags(Graph g, String keywords, Dataset dataset);
        void AddConceptScheme(Graph g);
        void AddCategory(Graph g);
    }
}