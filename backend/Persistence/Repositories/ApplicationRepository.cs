using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Repositories;
using OpenData.API.Persistence.Contexts;

namespace OpenData.API.Persistence.Repositories
{
    public class ApplicationRepository : BaseRepository, IApplicationRepository
    {
        public ApplicationRepository(AppDbContext context) : base(context)
        { }
        public async Task<IEnumerable<Application>> ListAsync()
        {
            return await _context.Applications
                                    .Include(a => a.Coordination)
                                    .Include(a => a.Dataset)
                                    .Include(a => a.Publisher)
                                    .ToListAsync();
        }

        public async Task AddAsync(Application Application)
        {
            await _context.Applications.AddAsync(Application);
        }

        public async Task<Application> FindByIdAsync(int id)
        {
            return await _context.Applications
                                    .Include(a => a.Coordination)
                                    .Include(a => a.Dataset)
                                    .Include(a => a.Publisher)
                                    .FirstOrDefaultAsync(i => i.Id == id);
        }

        public void Update(Application Application)
        {
            _context.Applications.Update(Application);
        }

        public void Remove(Application Application)
        {
            _context.Applications.Remove(Application);
        }
    }
}