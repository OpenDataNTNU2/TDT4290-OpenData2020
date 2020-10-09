using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Domain.Services
{
    public interface IDatasetService
    {
        Task<QueryResult<Dataset>> ListAsync(DatasetQuery query);
        Task<DatasetResponse> FindByIdAsync(int id);
        Task<DatasetResponse> SaveAsync(Dataset dataset);
        Task<DatasetResponse> UpdateAsync(int id, Dataset dataset);
        Task<DatasetResponse> DeleteAsync(int id);
    }
}