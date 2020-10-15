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
    public class CoordinationService : ICoordinationService
    {
        private readonly ICoordinationRepository _coordinationRepository;
        private readonly IPublisherRepository _publisherRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CoordinationService(ICoordinationRepository coordinationRepository, IPublisherRepository publisherRepository, IUnitOfWork unitOfWork)
        {
            _coordinationRepository = coordinationRepository;
            _publisherRepository = publisherRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Coordination>> ListAsync()
        {
            return await _coordinationRepository.ListAsync();
        }

        public async Task<CoordinationResponse> FindByIdAsync(int? id)
        {
            try
            {
                var res = await _coordinationRepository.FindByIdAsync(id);
                if (res == null)
                {
                    return new CoordinationResponse("Invalid coordination id.");
                }
                return new CoordinationResponse(res);
            }
            catch (Exception ex)
            {
                return new CoordinationResponse($"An error occurred when trying to get the dataset: {ex.Message}");
            }
        }
        public async Task<CoordinationResponse> SaveAsync(Coordination coordination)
        {
            try
            {
                var existingPublisher = await _publisherRepository.FindByIdAsync(coordination.PublisherId);
                if (existingPublisher == null)
                    return new CoordinationResponse("Invalid publisher id.");

                await _coordinationRepository.AddAsync(coordination);
                await _unitOfWork.CompleteAsync();

                return new CoordinationResponse(coordination);
            }
            catch(Exception ex)
            {
                return new CoordinationResponse($"An error occured when saving the coordination: {ex.Message}");
            }
        }


        public async Task<CoordinationResponse> UpdateAsync(int id, Coordination coordination)
        {
            var existingCoordination = await _coordinationRepository.FindByIdAsync(id);

            if (existingCoordination == null)
                return new CoordinationResponse("Coordination not found.");

            existingCoordination.Title = coordination.Title;
            existingCoordination.Description = coordination.Description;
            existingCoordination.UnderCoordination = coordination.UnderCoordination;
            existingCoordination.StatusDescription = coordination.StatusDescription;

            try
            {
                _coordinationRepository.Update(existingCoordination);
                await _unitOfWork.CompleteAsync();

                return new CoordinationResponse(existingCoordination);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new CoordinationResponse($"An error occurred when updating the coordination: {ex.Message}");
            }
        }
    }
}