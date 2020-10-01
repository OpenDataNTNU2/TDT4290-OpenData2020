using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Services
{
    public interface ITagsService
    {
        Task<IEnumerable<Tags>> ListAsync();
    }
}