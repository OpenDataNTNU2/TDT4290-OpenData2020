using System.Threading.Tasks;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Models.Queries;
using Supermarket.API.Domain.Services.Communication;

namespace Supermarket.API.Domain.Services
{
    public interface IDistributionService
    {
        Task<QueryResult<Distribution>> ListAsync(DistributionQuery query);
        Task<DistributionResponse> SaveAsync(Distribution distribution);
        Task<DistributionResponse> UpdateAsync(int id, Distribution distribution);
        Task<DistributionResponse> DeleteAsync(int id);
    }
}