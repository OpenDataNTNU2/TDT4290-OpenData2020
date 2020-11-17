using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Repositories;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Services.Communication;
using OpenData.API.Infrastructure;

namespace OpenData.API.Services
{
    public class DistributionService : IDistributionService
    {
        private readonly IDistributionRepository _distributionRepository;
        private readonly IDatasetRepository _datasetRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;

        public DistributionService(IDistributionRepository distributionRepository, IDatasetRepository datasetRepository, INotificationService notificationService, IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _distributionRepository = distributionRepository;
            _datasetRepository = datasetRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<QueryResult<Distribution>> ListAsync(DistributionQuery query)
        {
            // Here I list the query result from cache if they exist, but now the data can vary according to the dataset ID, page and amount of
            // items per page. I have to compose a cache to avoid returning wrong data.
            string cacheKey = GetCacheKeyForDistributionQuery(query);
            
            var distributions = await _cache.GetOrCreateAsync(cacheKey, (entry) => {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(0.01);
                return _distributionRepository.ListAsync(query);
            });

            return distributions;
        }

        public async Task<DistributionResponse> SaveAsync(Distribution distribution)
        {
            try
            {
                /*
                 Notice here we have to check if the dataset ID is valid before adding the distribution, to avoid errors.
                 You can create a method into the DatasetService class to return the dataset and inject the service here if you prefer, but 
                 it doesn't matter given the API scope.
                */
                var existingDataset = await _datasetRepository.FindByIdAsync(distribution.DatasetId);
                if (existingDataset == null)
                    return new DistributionResponse("Invalid dataset.");

                await _distributionRepository.AddAsync(distribution);
                
                // Send notification
                await _notificationService.AddUserNotificationsAsync(existingDataset, existingDataset, existingDataset.Title + " - " + existingDataset.Publisher.Name, "Datasettet '" + existingDataset.Title + "' har lagt til en ny distribusjon.");
                await _notificationService.AddPublisherNotificationsAsync(existingDataset, existingDataset, existingDataset.Title + " - " + existingDataset.Publisher.Name, "Datasettet ditt '" + existingDataset.Title + "' har lagt til en ny distribusjon.");

                await _unitOfWork.CompleteAsync();

                return new DistributionResponse(distribution);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new DistributionResponse($"An error occurred when saving the distribution: {ex.Message}");
            }
        }

        public async Task<DistributionResponse> UpdateAsync(int id, Distribution distribution)
        {
            var existingDistribution = await _distributionRepository.FindByIdAsync(id);

            if (existingDistribution == null)
                return new DistributionResponse("Distribution not found.");

            var existingDataset = await _datasetRepository.FindByIdAsync(distribution.DatasetId);
            if (existingDataset == null)
                return new DistributionResponse("Invalid dataset.");

            existingDistribution.Title = distribution.Title;
            existingDistribution.DatasetId = distribution.DatasetId;

            try
            {
                _distributionRepository.Update(existingDistribution);
                await _unitOfWork.CompleteAsync();

                return new DistributionResponse(existingDistribution);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new DistributionResponse($"An error occurred when updating the distribution: {ex.Message}");
            }
        }

        public async Task<DistributionResponse> DeleteAsync(int id)
        {
            var existingDistribution = await _distributionRepository.FindByIdAsync(id);

            if (existingDistribution == null)
                return new DistributionResponse("Distribution not found.");

            var existingDataset = await _datasetRepository.FindByIdAsync(existingDistribution.DatasetId);

            try
            {
                _distributionRepository.Remove(existingDistribution);

                // Send notification
                await _notificationService.AddUserNotificationsAsync(existingDataset, existingDataset, existingDataset.Title + " - " + existingDataset.Publisher.Name, "Datasettet '" + existingDataset.Title + "' har fjernet en distribusjon.");
                await _notificationService.AddPublisherNotificationsAsync(existingDataset, existingDataset, existingDataset.Title + " - " + existingDataset.Publisher.Name, "Datasettet ditt '" + existingDataset.Title + "' har fjernet en distribusjon.");

                await _unitOfWork.CompleteAsync();

                return new DistributionResponse(existingDistribution);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new DistributionResponse($"An error occurred when deleting the distribution: {ex.Message}");
            }
        }

        private string GetCacheKeyForDistributionQuery(DistributionQuery query)
        {
            string key = CacheKeys.DistributionList.ToString();
            
            if (query.DatasetId.HasValue && query.DatasetId > 0)
            {
                key = string.Concat(key, "_", query.DatasetId.Value);
            }

            key = string.Concat(key, "_", query.Page, "_", query.ItemsPerPage);
            return key;
        }
    }
}