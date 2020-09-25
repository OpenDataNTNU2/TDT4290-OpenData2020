using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Repositories;
using Supermarket.API.Domain.Services;
using Supermarket.API.Domain.Services.Communication;
using Supermarket.API.Infrastructure;

namespace Supermarket.API.Services
{
    public class DatasetService : IDatasetService
    {
        private readonly IDatasetRepository _datasetRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;

        public DatasetService(IDatasetRepository datasetRepository, IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _datasetRepository = datasetRepository;
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<IEnumerable<Dataset>> ListAsync()
        {
            // Here I try to get the datasets list from the memory cache. If there is no data in cache, the anonymous method will be
            // called, setting the cache to expire one minute ahead and returning the Task that lists the datasets from the repository.
            var datasets = await _cache.GetOrCreateAsync(CacheKeys.DatasetList, (entry) => {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(0.01);
                return _datasetRepository.ListAsync();
            });
            
            return datasets;
        }

        public async Task<DatasetResponse> SaveAsync(Dataset dataset)
        {
            try
            {
                await _datasetRepository.AddAsync(dataset);
                await _unitOfWork.CompleteAsync();

                return new DatasetResponse(dataset);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new DatasetResponse($"An error occurred when saving the dataset: {ex.Message}");
            }
        }

        public async Task<DatasetResponse> UpdateAsync(int id, Dataset dataset)
        {
            var existingDataset = await _datasetRepository.FindByIdAsync(id);

            if (existingDataset == null)
                return new DatasetResponse("Dataset not found.");

            existingDataset.Title = dataset.Title;

            try
            {
                await _unitOfWork.CompleteAsync();

                return new DatasetResponse(existingDataset);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new DatasetResponse($"An error occurred when updating the dataset: {ex.Message}");
            }
        }

        public async Task<DatasetResponse> DeleteAsync(int id)
        {
            var existingDataset = await _datasetRepository.FindByIdAsync(id);

            if (existingDataset == null)
                return new DatasetResponse("Dataset not found.");

            try
            {
                _datasetRepository.Remove(existingDataset);
                await _unitOfWork.CompleteAsync();

                return new DatasetResponse(existingDataset);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new DatasetResponse($"An error occurred when deleting the dataset: {ex.Message}");
            }
        }
    }
}
