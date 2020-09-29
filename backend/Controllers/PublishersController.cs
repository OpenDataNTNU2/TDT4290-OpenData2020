using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Supermarket.API.Domain.Models;
using Supermarket.API.Domain.Services;
using Supermarket.API.Resources;
using Microsoft.AspNetCore.Cors;

namespace Supermarket.API.Controllers
{
    [Route("/api/publishers")]
    [Produces("application/json")]
    [ApiController]
    public class PublishersController : Controller
    {
        private readonly IPublisherService _publisherService;
        private readonly IMapper _mapper;

        public PublishersController(IPublisherService publisherService, IMapper mapper)
        {
            _publisherService = publisherService;
            _mapper = mapper;
        }

        /// <summary>
        /// Lists all publishers.
        /// </summary>
        /// <returns>List os publishers.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PublisherResource>), 200)]
        public async Task<IEnumerable<PublisherResource>> ListAsync()
        {
            var publishers = await _publisherService.ListAsync();
            var resources = _mapper.Map<IEnumerable<Publisher>, IEnumerable<PublisherResource>>(publishers);

            return resources;
        }

        /// <summary>
        /// Saves a new publisher.
        /// </summary>
        /// <param name="resource">Publisher data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(PublisherResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SavePublisherResource resource)
        {
            var publisher = _mapper.Map<SavePublisherResource, Publisher>(resource);
            var result = await _publisherService.SaveAsync(publisher);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var publisherResource = _mapper.Map<Publisher, PublisherResource>(result.Resource);
            return Ok(publisherResource);
        }

        /// <summary>
        /// Updates an existing publisher according to an identifier.
        /// </summary>
        /// <param name="id">Publisher identifier.</param>
        /// <param name="resource">Updated publisher data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(PublisherResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SavePublisherResource resource)
        {
            var publisher = _mapper.Map<SavePublisherResource, Publisher>(resource);
            var result = await _publisherService.UpdateAsync(id, publisher);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var publisherResource = _mapper.Map<Publisher, PublisherResource>(result.Resource);
            return Ok(publisherResource);
        }

        /// <summary>
        /// Deletes a given publisher according to an identifier.
        /// </summary>
        /// <param name="id">Publisher identifier.</param>
        /// <returns>Response for the request.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(PublisherResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _publisherService.DeleteAsync(id);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var publisherResource = _mapper.Map<Publisher, PublisherResource>(result.Resource);
            return Ok(publisherResource);
        }
    }
}