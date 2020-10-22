using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Domain.Services
{
    public interface IUserService
    {
         Task<IEnumerable<User>> ListAsync();
         Task<UserResponse> SaveAsync(User user);
         Task<UserResponse> UpdateAsync(string id, User user);
         Task<UserResponse> DeleteAsync(int id);
         Task<UserResponse> FindByUsernameAsync(string username);
         Task<UserResponse> SubscribeAsync(Subscription subscription);
    }
}