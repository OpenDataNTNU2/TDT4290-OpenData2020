using System.Collections.Generic;
using System.Threading.Tasks;
using Supermarket.API.Domain.Models;

namespace Supermarket.API.Domain.Repositories
{
    public interface IDatasetRepository
    {
        Task<IEnumerable<Dataset>> ListAsync();
        Task AddAsync(Dataset dataset);
        Task<Dataset> FindByIdAsync(int id);
        void Update(Dataset dataset);
        void Remove(Dataset dataset);
    }
}