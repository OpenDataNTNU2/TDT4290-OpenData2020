using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Domain.Services
{
    public interface ICoordinationService
    {
        Task<IEnumerable<Coordination>> ListAsync();
        Task<CoordinationResponse> FindByIdAsync(int id);
        Task<CoordinationResponse> SaveAsync(Coordination coordination);
        Task<CoordinationResponse> UpdateAsync(int id, Coordination coordination);
    }
}