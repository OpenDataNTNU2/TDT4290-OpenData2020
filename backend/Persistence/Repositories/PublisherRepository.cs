using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Repositories;
using Supermarket.API.Persistence.Contexts;

namespace Supermarket.API.Persistence.Repositories
{
    public class PublisherRepository : BaseRepository, IPublisherRepository
    {
        public PublisherRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Publisher>> ListAsync()
        {
            return await _context.Publishers
                                .Include(d => d.Datasets)
                                .AsNoTracking()
                                .ToListAsync();

            // AsNoTracking tells EF Core it doesn't need to track changes on listed entities. Disabling entity
            // tracking makes the code a little faster
        }

        public async Task AddAsync(Publisher publisher)
        {
            await _context.Publishers.AddAsync(publisher);
        }

        public async Task<Publisher> FindByIdAsync(int id)
        {
            return await _context.Publishers.FindAsync(id);
        }

        public void Update(Publisher publisher)
        {
            _context.Publishers.Update(publisher);
        }

        public void Remove(Publisher publisher)
        {
            _context.Publishers.Remove(publisher);
        }
    }
}