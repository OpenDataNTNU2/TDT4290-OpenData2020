using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Repositories;
using OpenData.API.Persistence.Contexts;
using System;

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
                    .Include(p => p.Broader)
                    .Include(c => c.Datasets)
                    .Include(c => c.Coordinations)
                    .Include(p => p.Narrower).ThenInclude(c => c.Datasets)
                    .Include(p => p.Narrower).ThenInclude(c => c.Coordinations)
                    .Include(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(c => c.Datasets)
                    .Include(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(c => c.Coordinations)
                    .Include(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(c => c.Datasets)
                    .Include(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(c => c.Coordinations)
                    .Include(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(c => c.Datasets)
                    .Include(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(c => c.Coordinations)
                    .Include(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(c => c.Datasets)
                    .Include(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(p => p.Narrower).ThenInclude(c => c.Coordinations)
                    .AsNoTracking()
                    .ToListAsync();
            List<Category> remove = new List<Category>();
            for (var i = 0; i < categories.Count; i++)
            {
                if(categories[i].Broader != null)
                {   
                    remove.Add(categories[i]);
                    continue;
                }
                // categories[i] = await getCategoryWithNarrowers(categories[i].Id);
            }

            foreach (Category r in remove)
            {
                categories.Remove(r);
            }
            
            return categories;
        }

        private async Task<Category> getCategoryWithNarrowers(int id)
        {
            Category cat = await _context.Categories
                        .Include(c => c.Narrower)
                        .Include(c => c.Datasets)
                        .Include(c => c.Coordinations)
                        .Include(p => p.Broader)
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

        public async Task<IEnumerable<Category>> FlatListAsync()
        {
            return await _context.Categories
                        .AsNoTracking()
                        .ToListAsync();
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