using System.Collections.Generic;
using System.Threading.Tasks;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Services.Communication;

namespace Supermarket.API.Domain.Services
{
    public interface IDatasetService
    {
         Task<IEnumerable<Dataset>> ListAsync();
         Task<DatasetResponse> SaveAsync(Dataset dataset);
         Task<DatasetResponse> UpdateAsync(int id, Dataset dataset);
         Task<DatasetResponse> DeleteAsync(int id);
    }
}