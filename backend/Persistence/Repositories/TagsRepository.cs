using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Repositories;
using OpenData.API.Persistence.Contexts;

namespace OpenData.API.Persistence.Repositories
{
    public class TagsRepository : BaseRepository, ITagsRepository
    {
        public TagsRepository(AppDbContext context) : base(context)
        { }
        public async Task<IEnumerable<Tags>> ListAsync()
        {
            return await _context.Tags.ToListAsync();
        }

        public async Task AddAsync(Tags tags)
        {
            await _context.Tags.AddAsync(tags);
        }

        public async Task<Tags> FindByIdAsync(int id)
        {
            return await _context.Tags.FindAsync(id);
        }

        public void Update(Tags tags)
        {
            _context.Tags.Update(tags);
        }

        public void Remove(Tags tags){
            _context.Tags.Remove(tags);
        }
    }
}