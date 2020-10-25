using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Services.Communication;
using Microsoft.AspNetCore.JsonPatch;


namespace OpenData.API.Domain.Services
{
    public interface ICoordinationService
    {
        Task<QueryResult<Coordination>> ListAsync(CoordinationQuery query);
        Task<CoordinationResponse> FindByIdAsync(int id);
        Task<CoordinationResponse> SaveAsync(Coordination coordination);
        Task<CoordinationResponse> UpdateAsync(int id, Coordination coordination);
        Task<CoordinationResponse> UpdateAsync(int id, JsonPatchDocument<Coordination> patch);
    }
}