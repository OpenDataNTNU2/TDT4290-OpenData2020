using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;

namespace OpenData.API.Domain.Repositories
{
    public interface ICoordinationRepository
    {
        Task<QueryResult<Coordination>> ListAsync(CoordinationQuery query);
        Task<Coordination> FindByIdAsync(int id);
        Task<Coordination> AddAsync(Coordination coordination);
        void Update(Coordination coordination);
        void Remove(Coordination coordination);
    }
}
