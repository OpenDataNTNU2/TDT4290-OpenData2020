using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;

namespace OpenData.API.Domain.Repositories
{
    public interface ICoordinationRepository
    {
        Task<IEnumerable<Coordination>> ListAsync();
    }
}