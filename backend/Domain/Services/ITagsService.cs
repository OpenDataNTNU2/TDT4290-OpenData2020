using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Domain.Services
{
    public interface ITagsService
    {
        Task<IEnumerable<Tags>> ListAsync();
        Task<TagsResponse> SaveAsync(Tags tags);
        Task<TagsResponse> UpdateAsync(int id, Tags tags);
        Task<TagsResponse> DeleteAsync(int id);
    }
}