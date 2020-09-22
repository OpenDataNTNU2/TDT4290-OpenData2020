using System.Collections.Generic;
using System.Threading.Tasks;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Models.Queries;

namespace Supermarket.API.Domain.Repositories
{
    public interface IDistributionRepository
    {
        Task<QueryResult<Distribution>> ListAsync(DistributionQuery query);
        Task AddAsync(Distribution distribution);
        Task<Distribution> FindByIdAsync(int id);
        void Update(Distribution distribution);
        void Remove(Distribution distribution);
    }
}