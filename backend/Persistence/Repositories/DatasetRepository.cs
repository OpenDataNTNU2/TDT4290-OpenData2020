using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Repositories;
using OpenData.API.Persistence.Contexts;
using System;

namespace OpenData.API.Persistence.Repositories
{
    public class DatasetRepository : BaseRepository, IDatasetRepository
    {
        public DatasetRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Dataset>> ListAsync()
        {
            return await _context.Datasets
                                .Include(d => d.Distributions)
                                .Include(d => d.Publisher)
                                .Include(d => d.DatasetTags)
                                    .ThenInclude(d => d.Tags)
                                .AsNoTracking()
                                .ToListAsync();

            // AsNoTracking tells EF Core it doesn't need to track changes on listed entities. Disabling entity
            // tracking makes the code a little faster
        }

        public async Task AddAsync(Dataset dataset)
        {
            await _context.Datasets.AddAsync(dataset);
            foreach (string idString in dataset.TagsIds.Split(',')){
                int id = Int32.Parse(idString.Trim());
                Tags existingTag = await _context.Tags.FindAsync(id);
                if (existingTag != null){
                    DatasetTags datasetTag = new DatasetTags { Dataset = dataset, Tags = existingTag };

                    await _context.DatasetTags.AddAsync(datasetTag);
                    dataset.DatasetTags.Add(datasetTag);
                }
            }
        }

        public async Task<Dataset> FindByIdAsync(int id)
        {
            return await _context.Datasets
                                .Include(d => d.Distributions)
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