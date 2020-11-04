using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> ListAsync();
        Task AddAsync(User user);
        Task<User> FindByIdAsync(int id);
        Task<User> FindByUsernameAsync(string username);
        void Update(User user);
        void Remove(User user);
        Task AddSubscriptionAsync(Subscription subscription);
    }
}