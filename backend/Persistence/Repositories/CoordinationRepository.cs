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
                                        .ThenInclude(p => p.Users)
                                    .Include(c => c.Subscriptions)
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

            // Filter on Access Level
            if (!String.IsNullOrEmpty(query.AccessLevels))
            {
                // Parses the list of Access levels from string to list of EAccessLevels
                List<EAccessLevel> accessLevels = new List<EAccessLevel>();
                foreach (string accessLevel in query.AccessLevels.Split(','))
                {
                    if (accessLevel == null || accessLevel == "") continue;
                    Enum.TryParse(accessLevel.Trim(), out EAccessLevel aLevel);
                    accessLevels.Add(aLevel);
                }
                queryable = queryable.Where(d => accessLevels.Contains(d.AccessLevel));
            }

            // Filter on Publication status aka underCoordination
            if (!String.IsNullOrEmpty(query.PublicationStatuses))
            {
                // Parses the list of Publications statuses from string to list of bools
                List<bool> pubStatuses = new List<bool>();
                foreach (string pubStatus in query.PublicationStatuses.Split(','))
                {
                    if (pubStatus == null || pubStatus == "") continue;
                    string cleanedPubStatus = pubStatus.Trim().ToLower();

                    // coordination.underCoordination = false -> published
                    if (cleanedPubStatus == "published") {
                        pubStatuses.Add(false);
                    }
                    // coordination.underCoordination = true -> under coordination
                    else if (cleanedPubStatus == "under_coordination") {
                        pubStatuses.Add(true);
                    }
                }
                queryable = queryable.Where(d => pubStatuses.Contains(d.UnderCoordination));
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

            // Sorts the coordinations. Default order by date ascending
            string sortOrder = String.IsNullOrEmpty(query.SortOrder) ? "date_asc" : query.SortOrder.Trim().ToLower();
            switch (sortOrder)
            {
                case "title_desc":
                    queryable = queryable.OrderByDescending(d => d.Title);
                    break;
                case "title_asc":
                    queryable = queryable.OrderBy(d => d.Title);
                    break;
                case "date_desc":
                     queryable = queryable.OrderByDescending(d => d.DatePublished);
                    break;
                case "date_asc":
                    queryable = queryable.OrderBy(d => d.DatePublished);
                    break;
                default:
                    queryable = queryable.OrderBy(d => d.DatePublished);
                    break;
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
            // Simple way to include some depth in categories.
            Category cat = await _context.Categories
                        .Include(c => c.Narrower)
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
                        .FirstOrDefaultAsync(c => c.Id == id);
            return cat;
        }

        public async Task<Coordination> FindByIdAsync(int id)
        {
            return await _context.Coordinations
                                    .Include(c => c.Datasets).ThenInclude(c => c.Publisher)
                                    .Include(c => c.Datasets).ThenInclude(c => c.Distributions)
                                    .Include(c => c.Datasets).ThenInclude(c => c.Coordination)
                                    .Include(c => c.Publisher)
                                        .ThenInclude(p => p.Users)
                                    .Include(c => c.Subscriptions)
                                    .Include(c => c.Applications).ThenInclude(c => c.Dataset).ThenInclude(c => c.Publisher)     
                                    .Include(c => c.Applications).ThenInclude(c => c.Dataset).ThenInclude(c => c.Distributions) 
                                    .Include(d => d.Category)
                                    .Include(c => c.CoordinationTags)
                                        .ThenInclude(c => c.Tags)
                                    .FirstOrDefaultAsync(i => i.Id == id);
                                
                                
        }

        public async Task<Coordination> AddAsync(Coordination coordination)
        {
            return (await _context.Coordinations.AddAsync(coordination)).Entity;
        }

        public void Update(Coordination coordination)
        {
            _context.Coordinations.Update(coordination);
        }

        public void Remove(Coordination coordination)
        {
            _context.Coordinations.Remove(coordination);
        }
    }
}