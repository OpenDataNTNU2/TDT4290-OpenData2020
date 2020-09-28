using System.Collections.Generic;
using System.Threading.Tasks;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Services.Communication;

namespace Supermarket.API.Domain.Services
{
    public interface IUserService
    {
         Task<IEnumerable<User>> ListAsync();
         Task<UserResponse> SaveAsync(User user);
         Task<UserResponse> UpdateAsync(string id, User user);
         Task<UserResponse> DeleteAsync(int id);
    }
}