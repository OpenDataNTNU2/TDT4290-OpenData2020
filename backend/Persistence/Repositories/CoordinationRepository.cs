using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Repositories;
using OpenData.API.Persistence.Contexts;
using System.Linq;
using System;

namespace OpenData.API.Persistence.Repositories
{
    public class CoordinationRepository : BaseRepository, ICoordinationRepository
    {
        public CoordinationRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Coordination>> ListAsync()
        {
            return await _context.Coordinations
                                    .Include(c => c.Datasets)
                                    .ToListAsync();
        }

        public async Task<Coordination> FindByIdAsync(int? id)
        {
            return await _context.Coordinations.FindAsync(id);
                                
                                
        }
        public async Task AddAsync(Coordination coordination)
        {
            await _context.Coordinations.AddAsync(coordination);
        }
        public void Update(Coordination coordination)
        {
            _context.Coordinations.Update(coordination);
        }
    }
}