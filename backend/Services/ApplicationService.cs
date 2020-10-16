using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Repositories;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IDatasetRepository _datasetRepository;
        private readonly ICoordinationRepository _coordinationRepository;
        private readonly IUnitOfWork _unitOfWork;
        public ApplicationService(IApplicationRepository ApplicationRepository, IUnitOfWork unitOfWork, IDatasetRepository DatasetRepository, ICoordinationRepository CoordinationRepository)
        {
            _applicationRepository = ApplicationRepository;
            _datasetRepository = DatasetRepository;
            _coordinationRepository = CoordinationRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Application>> ListAsync()
        {
            return await _applicationRepository.ListAsync();
        }

        public async Task<ApplicationResponse> FindByIdAsync(int id)
        {
            try
            {
                var res = await _applicationRepository.FindByIdAsync(id);
                if (res == null)
                {
                    return new ApplicationResponse("Invalid application id.");
                }
                return new ApplicationResponse(res);
            }
            catch (Exception ex)
            {
                return new ApplicationResponse($"An error occurred when trying to get the dataset: {ex.Message}");
            }
        }

        public async Task<ApplicationResponse> SaveAsync(Application application)
        {
            try
            {
                (Boolean success, String error) check = await idChecks(application);
                if (!check.success)
                {
                    return new ApplicationResponse(check.error);
                }
                await _applicationRepository.AddAsync(application);
                await _unitOfWork.CompleteAsync();

                return new ApplicationResponse(application);
            }
            catch (Exception ex)
            {
                return new ApplicationResponse($"An error occured when saving the tag: {ex.Message}");
            }
        }

        public async Task<ApplicationResponse> UpdateAsync(int id, Application application)
        {
            var existingApplication = await _applicationRepository.FindByIdAsync(id);

            if (existingApplication == null)
                return new ApplicationResponse("Application not found.");

            existingApplication.Reason = application.Reason;

            try
            {
                _applicationRepository.Update(existingApplication);
                await _unitOfWork.CompleteAsync();

                return new ApplicationResponse(existingApplication);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new ApplicationResponse($"An error occurred when updating the Application: {ex.Message}");
            }
        }
        public async Task<ApplicationResponse> DeleteAsync(int id)
        {
            var existingApplication = await _applicationRepository.FindByIdAsync(id);

            if (existingApplication == null)
                return new ApplicationResponse("Application not found.");

            try
            {
                _applicationRepository.Remove(existingApplication);
                await _unitOfWork.CompleteAsync();

                return new ApplicationResponse(existingApplication);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new ApplicationResponse($"An error occurred when deleting the Application: {ex.Message}");
            }
        }

        private async Task<(Boolean success, String error)> idChecks(Application application)
        {
            var existingCoordination = await _coordinationRepository.FindByIdAsync(application.CoordinationId);
            if (existingCoordination == null)
                return (false, "Invalid Application id.");

            var existingDataset = await _datasetRepository.FindByIdAsync(application.DatasetId);
            if (existingDataset == null)
                return (false, "Invalid dataset id.");

            return (true, "Success");
        }
    }
}