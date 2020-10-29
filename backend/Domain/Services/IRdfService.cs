using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;
using System;

namespace OpenData.API.Domain.Services
{
    public interface IRdfService
    {
        Task<DatasetResponse> import(string url, int categoryId);
        Task<DatasetResponse> populate(int numberOfDatasets);
        Task<Boolean> importCategories(String url);
        void export();
    }
}