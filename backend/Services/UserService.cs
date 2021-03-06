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
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPublisherRepository _publisherRepository;
        private readonly IDatasetRepository _datasetRepository;
        private readonly ICoordinationRepository _coordinationRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;

        public UserService(IUserRepository userRepository, IPublisherRepository publisherRepository, IDatasetRepository datasetRepository, ICoordinationRepository coordinationRepository, INotificationService notificationService, IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _userRepository = userRepository;
            _publisherRepository = publisherRepository;
            _datasetRepository = datasetRepository;
            _coordinationRepository = coordinationRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<IEnumerable<User>> ListAsync()
        {
            // Here I try to get the users list from the memory cache. If there is no data in cache, the anonymous method will be
            // called, setting the cache to expire one minute ahead and returning the Task that lists the users from the repository.
            var users = await _cache.GetOrCreateAsync(CacheKeys.UserList, (entry) => {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(0.01);
                return _userRepository.ListAsync();
            });
            
            return users;
        }

        public async Task<UserResponse> FindByUsernameAsync(string username)
        {
            var existingUser = await _userRepository.FindByUsernameAsync(username);
            if (existingUser == null)
                return new UserResponse("User not found.");

            return new UserResponse(existingUser);
        }

        public async Task<UserResponse> SaveAsync(User user)
        {
            try
            {
                await _userRepository.AddAsync(user);
                await _unitOfWork.CompleteAsync();

                return new UserResponse(user);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new UserResponse($"An error occurred when saving the user: {ex.Message}");
            }
        }
        
        public async Task<UserResponse> UpdateAsync(string username, User user)
        {
            var existingUser = await _userRepository.FindByUsernameAsync(username);
            
            if (existingUser == null){
                // This is a simple login system without any authentication
                // If a user types in an existing user it is logged into that user id
                // If a user types in an existing municipality in a new username, a new user is created and connected to that municipality.
                if (user.Username.ToLower().Contains("kommune")){
                    try {
                        String mun = (String) user.Username.Split('_').GetValue(1);
                        
                        IEnumerable<Publisher> existingPublishers = await _publisherRepository.ListAsync();

                        foreach (Publisher publisher in existingPublishers){
                            if (publisher.Name.ToLower().Contains(mun.ToLower())){
                                user.PublisherId = publisher.Id;
                                break;
                            }
                        }
                        
                        if (user.PublisherId == null){
                            var newPublisher = new Publisher {Name = mun.Substring(0,1).ToUpper() + mun.Substring(1) + " Kommune"};
                            await _publisherRepository.AddAsync(newPublisher);
                            await _unitOfWork.CompleteAsync();
                            user.PublisherId = newPublisher.Id;
                        }
                    } catch(Exception e){ Console.WriteLine(e.ToString());}
                }

                return await SaveAsync(user);
            }
            
            
            try
            {
                await _unitOfWork.CompleteAsync();

                return new UserResponse(existingUser);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new UserResponse($"An error occurred when updating the user: {ex.Message}");
            }
        }

        public async Task<UserResponse> SubscribeAsync(Subscription subscription)
        {
            try
            {
                var user = await _userRepository.FindByIdAsync((int)subscription.UserId);
                if (user == null)
                    return new UserResponse("User not found.");

                if (subscription.DatasetId != null && subscription.DatasetId != 0)
                {
                    var dataset = await _datasetRepository.FindByIdAsync((int)subscription.DatasetId);
                    if (dataset == null)
                        return new UserResponse("Dataset not found.");
                    // Send notification
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "En bruker '" + user.Username + "' har abonnert på ditt dataset.");
                }
                else if (subscription.CoordinationId != null && subscription.CoordinationId != 0)
                {
                    var coordination = await _coordinationRepository.FindByIdAsync((int)subscription.CoordinationId);
                    if (coordination == null)
                        return new UserResponse("Coordination not found.");
                    // Send notification
                    await _notificationService.AddPublisherNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "En bruker '" + user.Username + "' har abonnert på din samordning.");
                }
                else
                {
                    return new UserResponse("No dataset or coordination was found.");
                }
                
                await _userRepository.AddSubscriptionAsync(subscription);
                await _unitOfWork.CompleteAsync();

                return new UserResponse(user);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new UserResponse($"An error occurred when saving the user: {ex.Message}");
            }
        }

        public async Task<UserResponse> DeleteAsync(int id)
        {
            var existingUser = await _userRepository.FindByIdAsync(id);

            if (existingUser == null)
                return new UserResponse("User not found.");

            try
            {
                _userRepository.Remove(existingUser);
                await _unitOfWork.CompleteAsync();

                return new UserResponse(existingUser);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new UserResponse($"An error occurred when deleting the user: {ex.Message}");
            }
        }
    }
}
