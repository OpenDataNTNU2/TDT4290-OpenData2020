using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Resources;

namespace OpenData.API.Controllers
{
    [Route("/api/[controller]")]
    public class TagsController : Controller
    {
        private readonly ITagsService _tagsService;
        private readonly IMapper _mapper;
        public TagsController(ITagsService tagsService, IMapper mapper)
        {
            _tagsService = tagsService;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IEnumerable<TagsResource>> GetAllAsync()
        {
            var tags = await _tagsService.ListAsync();
            var resources = _mapper.Map<IEnumerable<Tags>, IEnumerable<TagsResource>>(tags);
            
            return resources;
        }
    }
}