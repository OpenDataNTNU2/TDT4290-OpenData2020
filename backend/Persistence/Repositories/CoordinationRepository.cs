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

        public async Task<QueryResult<Coordination>> ListAsync(CoordinationQuery query)
        {
            IQueryable<Coordination> queryable = _context.Coordinations
                                    .Include(c => c.Datasets).ThenInclude(c => c.Publisher)
                                    .Include(c => c.Datasets).ThenInclude(c => c.Distributions)
                                    .Include(d => d.Category)
                                    .Include(c => c.Publisher)
                                    .Include(c => c.Applications).ThenInclude(c => c.Dataset).ThenInclude(c => c.Publisher)     
                                    .Include(c => c.Applications).ThenInclude(c => c.Dataset).ThenInclude(c => c.Distributions)                                         
                                    .Include(c => c.CoordinationTags)
                                        .ThenInclude(c => c.Tags)
                                    .AsNoTracking();

            // Filter on multiple publishers
            if (!String.IsNullOrEmpty(query.PublisherIds))
            {
                // Parses the list of publisher ids from string to list of ints
                List<int> publisherIds = new List<int>();
                foreach (string idString in query.PublisherIds.Split(','))
                {
                    if (idString == null || idString == "") continue;
                    int id = Int32.Parse(idString.Trim());
                    publisherIds.Add(id);
                }

                // Filters on the chosen publisher ids
                queryable = queryable.Where(d => publisherIds.Contains(d.PublisherId));
            }

            // Filter on Category
            if (!String.IsNullOrEmpty(query.CategoryIds))
            {
                // Parses the list of category ids from string to list of ints
                List<int> categoryIds = new List<int>();
                foreach (string idString in query.CategoryIds.Split(','))
                {
                    if (idString == null || idString == "") continue;
                    int id = Int32.Parse(idString.Trim());
                    categoryIds.Add(id);
                    Category c = await getCategoryWithNarrowers(id);
                    categoryIds.AddRange(getNarrowerIds(c));
                }

                queryable = queryable.Where(d => categoryIds.Contains(d.CategoryId));
            }

            // Checks if the search string is in the title, description, publisher name, and tags of the dataset
            if (!String.IsNullOrEmpty(query.Search))
            {
                queryable = queryable.Where(d =>
                   d.Title.ToLower().Contains(query.Search.Trim().ToLower()) ||
                   d.Description.ToLower().Contains(query.Search.Trim().ToLower()) ||
                   d.Publisher.Name.ToLower().Contains(query.Search.Trim().ToLower()) ||
                   d.CoordinationTags.Any(dt => dt.Tags.Name.ToLower().Contains(query.Search.Trim().ToLower()))
                   );
            }

            // Here I count all items present in the database for the given query, to return as part of the pagination data.
            int totalItems = await queryable.CountAsync();

            List<Coordination> coordinations = await queryable.Skip((query.Page - 1) * query.ItemsPerPage)
                                .Take(query.ItemsPerPage)
                                .ToListAsync();

            // Finally I return a query result, containing all items and the amount of items in the database (necessary for client-side calculations ).
            return new QueryResult<Coordination>
            {
                Items = coordinations,
                TotalItems = totalItems,
            };
        }

        private List<int> getNarrowerIds(Category category)
        {
            List<int> ids = new List<int>();
            if (category.Narrower != null)
            {
                foreach(Category narrow in category.Narrower)
                {
                    ids.Add(narrow.Id);
                    ids.AddRange(getNarrowerIds(narrow));
                }
            }
            return ids;
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

        public async Task<Coordination> FindByIdAsync(int id)
        {
            return await _context.Coordinations
                                    .Include(c => c.Datasets).ThenInclude(c => c.Publisher)
                                    .Include(c => c.Datasets).ThenInclude(c => c.Distributions)
                                    .Include(c => c.Publisher)
                                    .Include(c => c.Applications).ThenInclude(c => c.Dataset).ThenInclude(c => c.Publisher)     
                                    .Include(c => c.Applications).ThenInclude(c => c.Dataset).ThenInclude(c => c.Distributions) 
                                    .FirstOrDefaultAsync(i => i.Id == id);
                                
                                
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