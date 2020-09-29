using System.Collections.Generic;
using System.Threading.Tasks;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Services.Communication;

namespace Supermarket.API.Domain.Services
{
    public interface IPublisherService
    {
         Task<IEnumerable<Publisher>> ListAsync();
         Task<PublisherResponse> SaveAsync(Publisher publisher);
         Task<PublisherResponse> UpdateAsync(int id, Publisher publisher);
         Task<PublisherResponse> DeleteAsync(int id);
    }
}