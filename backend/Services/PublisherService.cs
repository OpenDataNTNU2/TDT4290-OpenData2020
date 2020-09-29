using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Repositories;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Services.Communication;
using OpenData.API.Infrastructure;

namespace OpenData.API.Services
{
    public class PublisherService : IPublisherService
    {
        private readonly IPublisherRepository _publisherRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;

        public PublisherService(IPublisherRepository publisherRepository, IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _publisherRepository = publisherRepository;
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<IEnumerable<Publisher>> ListAsync()
        {
            // Here I try to get the publishers list from the memory cache. If there is no data in cache, the anonymous method will be
            // called, setting the cache to expire one minute ahead and returning the Task that lists the publishers from the repository.
            var publishers = await _cache.GetOrCreateAsync(CacheKeys.PublisherList, (entry) => {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(0.01);
                return _publisherRepository.ListAsync();
            });
            
            return publishers;
        }

        public async Task<PublisherResponse> SaveAsync(Publisher publisher)
        {
            try
            {
                await _publisherRepository.AddAsync(publisher);
                await _unitOfWork.CompleteAsync();

                return new PublisherResponse(publisher);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new PublisherResponse($"An error occurred when saving the publisher: {ex.Message}");
            }
        }

        public async Task<PublisherResponse> UpdateAsync(int id, Publisher publisher)
        {
            var existingPublisher = await _publisherRepository.FindByIdAsync(id);

            if (existingPublisher == null)
                return new PublisherResponse("Publisher not found.");

            existingPublisher.Name = publisher.Name;

            try
            {
                await _unitOfWork.CompleteAsync();

                return new PublisherResponse(existingPublisher);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new PublisherResponse($"An error occurred when updating the publisher: {ex.Message}");
            }
        }

        public async Task<PublisherResponse> DeleteAsync(int id)
        {
            var existingPublisher = await _publisherRepository.FindByIdAsync(id);

            if (existingPublisher == null)
                return new PublisherResponse("Publisher not found.");

            try
            {
                _publisherRepository.Remove(existingPublisher);
                await _unitOfWork.CompleteAsync();

                return new PublisherResponse(existingPublisher);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new PublisherResponse($"An error occurred when deleting the publisher: {ex.Message}");
            }
        }
    }
}
