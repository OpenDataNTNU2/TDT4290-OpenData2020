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
        private readonly ITagsRepository _tagsRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;

        public DatasetService(IDatasetRepository datasetRepository, ITagsRepository tagsRepository, IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _datasetRepository = datasetRepository;
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
                return new DatasetResponse(await _datasetRepository.FindByIdAsync(id));
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
                await _datasetRepository.AddAsync(dataset);
                await _unitOfWork.CompleteAsync();

                try 
                {
                    foreach (string idString in dataset.TagsIds.Split(','))
                    {
                        if(idString == null || idString == "") continue;
                        int id = Int32.Parse(idString.Trim());
                        Tags existingTag = await _tagsRepository.FindByIdAsync(id);
                        if (existingTag != null){
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
