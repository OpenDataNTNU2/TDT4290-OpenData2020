using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Repositories
{
    public interface IApplicationRepository
    {
        Task<IEnumerable<Application>> ListAsync();
        Task AddAsync(Application Application);
        Task<Application> FindByIdAsync(int id);
        void Update(Application Application);
        void Remove(Application Application);
    }
}