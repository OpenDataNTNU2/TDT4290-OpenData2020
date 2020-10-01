using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Repositories;

namespace OpenData.API.Services
{
    public class TagsService : ITagsService
    {
        private readonly ITagsRepository _tagsRepository;
        public TagsService(ITagsRepository tagsRepository){
            this._tagsRepository = tagsRepository;
        }
        public async Task<IEnumerable<Tags>> ListAsync()
        {
            return await _tagsRepository.ListAsync();
        }
    }
}