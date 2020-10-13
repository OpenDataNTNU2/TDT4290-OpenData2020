using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Repositories;
using OpenData.API.Persistence.Contexts;

namespace OpenData.API.Persistence.Repositories
{
    public class CategoryRepository : BaseRepository, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Category>> ListAsync()
        {
            var categories =  await _context.Categories
                    .Include(p => p.Datasets)
                        .ThenInclude(d => d.Distributions)
                    .Include(p => p.Broader)
                    .AsNoTracking()
                    .ToListAsync();
                  
            for (var i = 0; i < categories.Count; i++)
            {
                categories[i] = await getCategoryWithNarrowers(categories[i].Id);
            }
            
            return categories;
        }

        private async Task<Category> getCategoryWithNarrowers(int id)
        {
            Category cat = await _context.Categories
                        .Include(c => c.Narrower)
                        .FirstOrDefaultAsync(c => c.Id == id);
            for (var i = 0; i < cat.Narrower.Count; i++)
            {
                if (cat.Narrower[i] != null)
                {
                    cat.Narrower[i] = await getCategoryWithNarrowers(cat.Narrower[i].Id);
                }
            }
            return cat;
        }

        public async Task AddAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
        }

        public async Task<Category> FindByIdAsync(int id)
        {
            return await _context.Categories
                            .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}