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
                            .Include(d => d.Distributions)
                            .Include(d => d.Publisher)
                            .Include(d => d.DatasetTags)
                                .ThenInclude(d => d.Tags)
                            .Include(d => d.Category)
                            .AsNoTracking();
            if (query.Search != null && query.Search != "")
			{
				queryable = queryable.Where( d => 
                    d.Title.ToLower().Contains(query.Search.Trim().ToLower()) ||
                    d.Description.ToLower().Contains(query.Search.Trim().ToLower()) ||
                    d.Publisher.Name.ToLower().Contains(query.Search.Trim().ToLower()) 
                    // ||
                    // d.DatasetTags.Where(dt => dt.Tags.Name.ToLower().Contains(query.Search.Trim().ToLower())  
                    );
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
                                .Include(d => d.Distributions)
                                .Include(d => d.Publisher)
                                .Include(d => d.DatasetTags)
                                    .ThenInclude(d => d.Tags)
                                .Include(d => d.Category)
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