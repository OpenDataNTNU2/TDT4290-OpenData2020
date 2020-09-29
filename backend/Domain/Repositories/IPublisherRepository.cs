using System.Collections.Generic;
using System.Threading.Tasks;
using Supermarket.API.Domain.Models;

namespace Supermarket.API.Domain.Repositories
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