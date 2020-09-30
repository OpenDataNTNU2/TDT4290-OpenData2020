using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Domain.Services
{
    public interface IPublisherService
    {
         Task<IEnumerable<Publisher>> ListAsync();
         Task<PublisherResponse> SaveAsync(Publisher publisher);
         Task<PublisherResponse> UpdateAsync(int id, Publisher publisher);
         Task<PublisherResponse> DeleteAsync(int id);
    }
}