using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Repositories
{
    public interface IDatasetRepository
    {
        Task<IEnumerable<Dataset>> ListAsync();
        Task AddAsync(Dataset dataset);
        Task AddDatasetTags(DatasetTags datasetTags);
        Task<Dataset> FindByIdAsync(int id);
        void Update(Dataset dataset);
        void Remove(Dataset dataset);
    }
}