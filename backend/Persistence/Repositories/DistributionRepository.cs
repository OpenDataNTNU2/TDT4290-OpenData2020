using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Models.Queries;
using Supermarket.API.Domain.Repositories;
using Supermarket.API.Persistence.Contexts;

namespace Supermarket.API.Persistence.Repositories
{
	public class DistributionRepository : BaseRepository, IDistributionRepository
	{
		public DistributionRepository(AppDbContext context) : base(context) { }

		public async Task<QueryResult<Distribution>> ListAsync(DistributionQuery query)
		{
			IQueryable<Distribution> queryable = _context.Distributions
													.Include(p => p.Dataset)
													.AsNoTracking();

			// AsNoTracking tells EF Core it doesn't need to track changes on listed entities. Disabling entity
			// tracking makes the code a little faster
			if (query.DatasetId.HasValue && query.DatasetId > 0)
			{
				queryable = queryable.Where(p => p.DatasetId == query.DatasetId);
			}

			// Here I count all items present in the database for the given query, to return as part of the pagination data.
			int totalItems = await queryable.CountAsync();

			// Here I apply a simple calculation to skip a given number of items, according to the current page and amount of items per page,
			// and them I return only the amount of desired items. The methods "Skip" and "Take" do the trick here.
			List<Distribution> distributions = await queryable.Skip((query.Page - 1) * query.ItemsPerPage)
													.Take(query.ItemsPerPage)
													.ToListAsync();

			// Finally I return a query result, containing all items and the amount of items in the database (necessary for client-side calculations ).
			return new QueryResult<Distribution>
			{
				Items = distributions,
				TotalItems = totalItems,
			};
		}

		public async Task<Distribution> FindByIdAsync(int id)
		{
			return await _context.Distributions
								 .Include(p => p.Dataset)
								 .FirstOrDefaultAsync(p => p.Id == id); // Since Include changes the method's return type, we can't use FindAsync
		}

		public async Task AddAsync(Distribution distribution)
		{
			await _context.Distributions.AddAsync(distribution);
		}

		public void Update(Distribution distribution)
		{
			_context.Distributions.Update(distribution);
		}

		public void Remove(Distribution distribution)
		{
			_context.Distributions.Remove(distribution);
		}
	}
}