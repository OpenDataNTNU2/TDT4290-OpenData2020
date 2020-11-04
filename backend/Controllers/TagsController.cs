using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Resources;
using OpenData.API.Extensions;

namespace OpenData.API.Controllers
{
    [Route("/api/tags")]
    [Produces("application/json")]
    [ApiController]
    public class TagsController : Controller
    {
        private readonly ITagsService _tagsService;
        private readonly IMapper _mapper;
        public TagsController(ITagsService tagsService, IMapper mapper)
        {
            _tagsService = tagsService;
            _mapper = mapper;
        }

        /// <summary>
        /// Lists all tags.
        /// </summary>
        /// <returns>List of tags.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TagsResource>), 200)]
        public async Task<IEnumerable<TagsResource>> GetAllAsync()
        {
            var tags = await _tagsService.ListAsync();
            var resources = _mapper.Map<IEnumerable<Tags>, IEnumerable<TagsResource>>(tags);
            
            return resources;
        }

        /// <summary>
        /// Saves a new tag.
        /// </summary>
        /// <param name="resource">Tag data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(TagsResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SaveTagsResource resource)
        {
                if (!ModelState.IsValid)
                        return BadRequest(ModelState.GetErrorMessages());
                
                var tags = _mapper.Map<SaveTagsResource, Tags>(resource);
                var result = await _tagsService.SaveAsync(tags);

                if (!result.Success)
                        return BadRequest(result.Message);

                var tagsResource = _mapper.Map<Tags, TagsResource>(result.Resource);
                return Ok(tagsResource);
        }

        /// <summary>
        /// Updates an existing tag according to an identifier.
        /// </summary>
        /// <param name="id">Tag identifier.</param>
        /// <param name="resource">Updated tag data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(TagsResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveTagsResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var tags = _mapper.Map<SaveTagsResource, Tags>(resource);
            var result = await _tagsService.UpdateAsync(id, tags);

            if (!result.Success)
                return BadRequest(result.Message);

            var tagsResource = _mapper.Map<Tags, TagsResource>(result.Resource);
            return Ok(tagsResource);
        }

        /// <summary>
        /// Deletes a given tag according to an identifier.
        /// </summary>
        /// <param name="id">Tag identifier.</param>
        /// <returns>Response for the request.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(TagsResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _tagsService.DeleteAsync(id);

            if (!result.Success)
                return BadRequest(result.Message);

            var tagsResource = _mapper.Map<Tags, TagsResource>(result.Resource);
            return Ok(tagsResource);
        }
    }
}