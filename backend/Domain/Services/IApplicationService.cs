using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Domain.Services
{
    public interface IApplicationService
    {
        Task<IEnumerable<Application>> ListAsync();
        Task<ApplicationResponse> FindByIdAsync(int id);
        Task<ApplicationResponse> SaveAsync(Application Application);
        Task<ApplicationResponse> UpdateAsync(int id, Application Application);
        Task<ApplicationResponse> DeleteAsync(int id);
    }
}