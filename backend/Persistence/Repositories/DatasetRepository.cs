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
            if (!String.IsNullOrEmpty(query.CategoryId))
            {
                queryable = queryable.Where(d => d.Category.Id == Int32.Parse(query.CategoryId));
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

        public async Task AddAsync(Dataset dataset)
        {
            await _context.Datasets.AddAsync(dataset);
        }

        public async Task<Dataset> FindByIdAsync(int id)
        {
            return await _context.Datasets
                                .Include(d => d.Publisher)
                                .Include(d => d.Category)
                                .Include(d => d.Distributions)
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
    }
}