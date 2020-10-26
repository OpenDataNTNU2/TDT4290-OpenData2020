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
    public class DatasetRepository : BaseRepository, IDatasetRepository
    {
        public DatasetRepository(AppDbContext context) : base(context) { }

        public async Task<QueryResult<Dataset>> ListAsync(DatasetQuery query)
        {
            IQueryable<Dataset> queryable = _context.Datasets
                            .Include(d => d.Publisher)
                            .Include(d => d.Category)
                            .Include(d => d.Distributions)
                            .Include(d => d.Coordination)
                            .Include(d => d.Subscriptions)
                            .Include(d => d.DatasetTags)
                                .ThenInclude(d => d.Tags)
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

            // Filter on Publication status
            if (!String.IsNullOrEmpty(query.PublicationStatuses))
            {
                // Parses the list of Publications statuses from string to list of EPublicationStatus
                List<EPublicationStatus> pubStatuses = new List<EPublicationStatus>();
                foreach (string pubStatus in query.PublicationStatuses.Split(','))
                {
                    if (pubStatus == null || pubStatus == "") continue;
                    Enum.TryParse(pubStatus.Trim(), out EPublicationStatus status);
                    pubStatuses.Add(status);
                }
                queryable = queryable.Where(d => pubStatuses.Contains(d.PublicationStatus));
            }


            // Checks if the search string is in the title, description, publisher name, and tags of the dataset
            if (!String.IsNullOrEmpty(query.Search))
            {
                queryable = queryable.Where(d =>
                   d.Title.ToLower().Contains(query.Search.Trim().ToLower()) ||
                   d.Description.ToLower().Contains(query.Search.Trim().ToLower()) ||
                   d.Publisher.Name.ToLower().Contains(query.Search.Trim().ToLower()) ||
                   d.DatasetTags.Any(dt => dt.Tags.Name.ToLower().Contains(query.Search.Trim().ToLower())
                   ));
            }

            // Sorts the datasets. Default order by title ascending
            string sortOrder = String.IsNullOrEmpty(query.SortOrder) ? "title_asc" : query.SortOrder.Trim().ToLower();
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
                    queryable = queryable.OrderBy(d => d.Title);
                    break;
            }

            // Here I count all items present in the database for the given query, to return as part of the pagination data.
            int totalItems = await queryable.CountAsync();

            List<Dataset> datasets = await queryable.Skip((query.Page - 1) * query.ItemsPerPage)
                                .Take(query.ItemsPerPage)
                                .ToListAsync();

            // Finally I return a query result, containing all items and the amount of items in the database (necessary for client-side calculations ).
            return new QueryResult<Dataset>
            {
                Items = datasets,
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

        public async Task AddAsync(Dataset dataset)
        {
            await _context.Datasets.AddAsync(dataset);
        }

        public async Task<Dataset> FindByIdAsync(int id)
        {
            return await _context.Datasets
                                .Include(d => d.Publisher)
                                    .ThenInclude(d => d.Users)
                                .Include(d => d.Category)
                                .Include(d => d.Distributions)
                                .Include(d => d.Coordination)
                                .Include(d => d.Subscriptions)
                                .Include(d => d.DatasetTags)
                                    .ThenInclude(d => d.Tags)
                                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public void Update(Dataset dataset)
        {
            _context.Datasets.Update(dataset);
        }

        public void Remove(Dataset dataset)
        {
            _context.Datasets.Remove(dataset);
        }

        public async Task AddNotificationAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
        }
    }
}