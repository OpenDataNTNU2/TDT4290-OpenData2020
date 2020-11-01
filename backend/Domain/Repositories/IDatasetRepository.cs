using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;

namespace OpenData.API.Domain.Repositories
{
    public interface IDatasetRepository
    {
        Task<QueryResult<Dataset>> ListAsync(DatasetQuery query);
        Task<Dataset> AddAsync(Dataset dataset);
        Task<Dataset> FindByIdAsync(int id);
        void Update(Dataset dataset);
        void Remove(Dataset dataset);
    }
}