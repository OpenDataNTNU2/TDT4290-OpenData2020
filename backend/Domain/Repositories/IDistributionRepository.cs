using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;

namespace OpenData.API.Domain.Repositories
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