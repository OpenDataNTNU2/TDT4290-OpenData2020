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
        {

        }
        public async Task<IEnumerable<Tags>> ListAsync()
        {
            return await _context.Tags.ToListAsync();
        }
    }
}