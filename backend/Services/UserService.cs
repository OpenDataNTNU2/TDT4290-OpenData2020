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
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;

        public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _userRepository = userRepository;
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
                int first = user.Username.IndexOf("_");
                int last = user.Username.LastIndexOf("_");
                String mun = user.Username.Substring(first,last);
                Console.WriteLine(mun);

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
