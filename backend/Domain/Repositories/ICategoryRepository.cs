using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Repositories
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> ListAsync();
        Task<IEnumerable<Category>> FlatListAsync();
        Task AddAsync(Category category);
        Task<Category> FindByIdAsync(int id);
    }
}