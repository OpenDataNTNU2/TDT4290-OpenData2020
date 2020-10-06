using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Domain.Services
{
    public interface IDistributionService
    {
        Task<QueryResult<Distribution>> ListAsync(DistributionQuery query);
        Task<DistributionResponse> SaveAsync(Distribution distribution);
        Task<DistributionResponse> UpdateAsync(int id, Distribution distribution);
        Task<DistributionResponse> DeleteAsync(int id);
    }
}