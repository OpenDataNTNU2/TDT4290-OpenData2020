using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Repositories
{
    public interface ITagsRepository
    {
        Task<IEnumerable<Tags>> ListAsync();
        Task AddAsync(Tags tags);
        Task<Tags> FindByIdAsync(int id);
        void Update(Tags tags);
        void Remove(Tags tags);
    }
}