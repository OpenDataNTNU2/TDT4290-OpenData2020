using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Repositories
{
    public interface IPublisherRepository
    {
        Task<IEnumerable<Publisher>> ListAsync();
        Task AddAsync(Publisher publisher);
        Task<Publisher> FindByIdAsync(int id);
        void Update(Publisher publisher);
        void Remove(Publisher publisher);
    }
}