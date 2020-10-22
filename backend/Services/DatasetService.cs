using System;
using System.Collections.Generic;
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
    public class DatasetService : IDatasetService
    {
        private readonly IDatasetRepository _datasetRepository;
        private readonly IPublisherRepository _publisherRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ICoordinationRepository _coordinationRepository;
        private readonly ITagsRepository _tagsRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;

        public DatasetService(IDatasetRepository datasetRepository, IPublisherRepository publisherRepository, ICategoryRepository categoryRepository, ICoordinationRepository coordinationRepository, ITagsRepository tagsRepository, IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _datasetRepository = datasetRepository;
            _publisherRepository = publisherRepository;
            _categoryRepository = categoryRepository;
            _coordinationRepository = coordinationRepository;
            _tagsRepository = tagsRepository;
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<QueryResult<Dataset>> ListAsync(DatasetQuery query)
        {
            // Here I try to get the datasets list from the memory cache. If there is no data in cache, the anonymous method will be
            // called, setting the cache to expire one minute ahead and returning the Task that lists the datasets from the repository.

            // var datasets = await _cache.GetOrCreateAsync(CacheKeys.DatasetList, (entry) => {
            //     entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(0.01);
            //     return _datasetRepository.ListAsync();
            // });

            return await _datasetRepository.ListAsync(query);
        }

        public async Task<DatasetResponse> FindByIdAsync(int id)
        {
            try
            {
                var res = await _datasetRepository.FindByIdAsync(id);
                if (res == null)
                {
                    return new DatasetResponse("Invalid dataset id.");
                }
                return new DatasetResponse(res);
            }
            catch (Exception ex)
            {
                return new DatasetResponse($"An error occurred when trying to get the dataset: {ex.Message}");
            }
        }

        public async Task<DatasetResponse> SaveAsync(Dataset dataset)
        {
            try
            {
                (Boolean success, String error) check = await idChecks(dataset);
                if (!check.success)
                {
                    return new DatasetResponse(check.error);
                }
                dataset.DatePublished = DateTime.Now;
                dataset.DateLastUpdated = DateTime.Now;
                await _datasetRepository.AddAsync(dataset);
                await _unitOfWork.CompleteAsync();

                await addTags(dataset);

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

            try
            {
                (Boolean success, String error) check = await idChecks(dataset);
                if (!check.success)
                {
                    return new DatasetResponse(check.error);
                }
                // Update attributes
                existingDataset.Title = dataset.Title; 
                existingDataset.Identifier = dataset.Identifier; 
                existingDataset.Description = dataset.Description; 
                existingDataset.DateLastUpdated = DateTime.Now;
                existingDataset.PublisherId = dataset.PublisherId; 
                existingDataset.PublicationStatus = dataset.PublicationStatus; 
                existingDataset.DatePlannedPublished = dataset.DatePlannedPublished; 
                existingDataset.AccessLevel = dataset.AccessLevel; 
                existingDataset.TagsIds = dataset.TagsIds; 
                existingDataset.CategoryId = dataset.CategoryId; 
                existingDataset.CoordinationId = dataset.CoordinationId;
                existingDataset.InterestCounter = dataset.InterestCounter;

                existingDataset.DatasetTags.Clear();
                await addTags(existingDataset);

                _datasetRepository.Update(existingDataset);
                await _unitOfWork.CompleteAsync();

                await AddUserNotificationsAsync(existingDataset, "Datasettet '" + existingDataset.Title + "' har blitt oppdatert.");
                await AddPublisherNotificationsAsync(existingDataset, "Datasettet ditt '" + existingDataset.Title + "' har blitt oppdatert.");

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


        public async Task AddUserNotificationsAsync(Dataset dataset, string msg)
        {
            foreach(Subscription subscription in dataset.Subscriptions)
            {
                int userId = subscription.UserId;
                await _datasetRepository.AddNotificationAsync(userId, dataset.Id, msg);
            }
            await _unitOfWork.CompleteAsync();
        }

        public async Task AddPublisherNotificationsAsync(Dataset dataset, string msg)
        {
            foreach(User user in dataset.Publisher.Users)
            {
                await _datasetRepository.AddNotificationAsync(user.Id, dataset.Id, msg);
            }
            await _unitOfWork.CompleteAsync();
        }

        private async Task<(Boolean success,String error)> idChecks(Dataset dataset)
        {
            // Make sure the publisher exists
            var existingPublisher = await _publisherRepository.FindByIdAsync(dataset.PublisherId);
            if (existingPublisher == null)
                return (false, "Invalid publisher id.");

            // Make sure the category exists
            var existingCategory = await _categoryRepository.FindByIdAsync(dataset.CategoryId);
            if (existingCategory == null)
                return (false, "Invalid category id.");

            // Make sure the coordination exists if present
            if (dataset.CoordinationId != null)
            {
                var existingCoordination = await _coordinationRepository.FindByIdAsync((int)dataset.CoordinationId);
                if (existingCoordination == null)
                    return (false, "Invalid coordination id.");
            }
            return (true, "Success.");
        }

        private async Task addTags(Dataset dataset)
        {
            try
            {
                // Tries to parse tag ids from string to int
                foreach (string idString in dataset.TagsIds.Split(','))
                {
                    if (idString == null || idString == "") continue;
                    int id = Int32.Parse(idString.Trim());
                    Tags existingTag = await _tagsRepository.FindByIdAsync(id);
                    if (existingTag != null)
                    {
                        // If the tag exists, add it to the list of tags in the dataset
                        DatasetTags datasetTag = new DatasetTags { Dataset = dataset, Tags = existingTag };
                        dataset.DatasetTags.Add(datasetTag);
                    }
                }
                await _unitOfWork.CompleteAsync();
            }
            catch (Exception ex)
            {
                await _unitOfWork.CompleteAsync();
                Console.WriteLine(ex.Message);
            }
        }
    }
}
