using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using System.Collections.Generic;
using System;
using VDS.RDF;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Domain.Services
{
    public interface IGraphService
    {
        Task<DatasetResponse> AddDataset(Graph g, int categoryId);
        Task<List<Distribution>> AddDistribution(Graph g, int datasetId);
        Task<Publisher> AddPublisher(Graph g);
        Task AddTags(Graph g, String keywords, Dataset dataset);
        Task<Boolean> AddConceptScheme(Graph g);
        Task<Boolean> AddCategory(Graph g, Category Broader);
    }
}