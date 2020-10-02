using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Services;
using OpenData.API.Resources;

namespace OpenData.API.Controllers
{
    [Route("/api/distributions")]
    [Produces("application/json")]
    [ApiController]
    public class DistributionController : Controller
    {
        private readonly IDistributionService _distributionService;
        private readonly IMapper _mapper;

        public DistributionController(IDistributionService distributionService, IMapper mapper)
        {
            _distributionService = distributionService;
            _mapper = mapper;
        }

        /// <summary>
        /// Lists all existing distributions.
        /// </summary>
        /// <returns>List of distributions.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(QueryResultResource<DistributionResource>), 200)]
        public async Task<QueryResultResource<DistributionResource>> ListAsync([FromQuery] DistributionQueryResource query)
        {
            var distributionsQuery = _mapper.Map<DistributionQueryResource, DistributionQuery>(query);
            var queryResult = await _distributionService.ListAsync(distributionsQuery);

            var resource = _mapper.Map<QueryResult<Distribution>, QueryResultResource<DistributionResource>>(queryResult);
            return resource;
        }

        /// <summary>
        /// Saves a new distribution.
        /// </summary>
        /// <param name="resource">Distribution data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(DistributionResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SaveDistributionResource resource)
        {
            var distribution = _mapper.Map<SaveDistributionResource, Distribution>(resource);
            var result = await _distributionService.SaveAsync(distribution);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var distributionResource = _mapper.Map<Distribution, DistributionResource>(result.Resource);
            return Ok(distributionResource);
        }

        /// <summary>
        /// Updates an existing distribution according to an identifier.
        /// </summary>
        /// <param name="id">Distribution identifier.</param>
        /// <param name="resource">Distribution data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DistributionResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveDistributionResource resource)
        {
            var distribution = _mapper.Map<SaveDistributionResource, Distribution>(resource);
            var result = await _distributionService.UpdateAsync(id, distribution);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var distributionResource = _mapper.Map<Distribution, DistributionResource>(result.Resource);
            return Ok(distributionResource);
        }

        /// <summary>
        /// Deletes a given distribution according to an identifier.
        /// </summary>
        /// <param name="id">Distribution identifier.</param>
        /// <returns>Response for the request.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(DistributionResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _distributionService.DeleteAsync(id);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var datasetResource = _mapper.Map<Distribution, DistributionResource>(result.Resource);
            return Ok(datasetResource);
        }
    }
}