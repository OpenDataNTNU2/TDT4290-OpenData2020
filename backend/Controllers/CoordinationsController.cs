using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Services;
using OpenData.API.Resources;
using Microsoft.AspNetCore.Cors;
using OpenData.API.Extensions;
using Microsoft.AspNetCore.JsonPatch;


namespace OpenData.API.Controllers
{
    [Route("/api/coordinations")]
    [Produces("application/json")]
    [ApiController]

    public class CoordinationsController : Controller
    {
        private readonly ICoordinationService _coordinationService;
        private readonly IMapper _mapper;
        
        public CoordinationsController(ICoordinationService coordinationService, IMapper mapper)
        {
            _coordinationService = coordinationService;   
            _mapper = mapper;
        }

        /// <summary>
        /// Lists all coordinations.
        /// </summary>
        /// <param name="query">Query containing search, filters and page.</param>
        /// <returns>List of coordinations.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(QueryResultResource<CoordinationResource>), 200)]
        public async Task<QueryResultResource<CoordinationResource>> ListAsync([FromQuery] CoordinationQueryResource query)
        {
            var coordinationsQuery = _mapper.Map<CoordinationQueryResource, CoordinationQuery>(query);
            var coordinations = await _coordinationService.ListAsync(coordinationsQuery);

            var resources = _mapper.Map<QueryResult<Coordination>, QueryResultResource<CoordinationResource>>(coordinations);
            return resources;
        }

        /// <summary>
        /// Find one coordination by id.
        /// </summary>
        /// <param name="id">Coordination identifier.</param>
        /// <returns>Coordination found by id.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CoordinationResource), 200)]
        public async Task<CoordinationResource> FindByIdAsync(int id)
        {
            var coordination = await _coordinationService.FindByIdAsync(id);
            var resource = _mapper.Map<Coordination, CoordinationResource>(coordination.Resource);

            return resource;
        }


        /// <summary>
        /// Saves a new coordination.
        /// </summary>
        /// <param name="resource">Coordination data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost]
        [HttpPost]
        [ProducesResponseType(typeof(CoordinationResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SaveCoordinationResource resource)
        {
            if(!ModelState.IsValid)
                    return BadRequest(ModelState.GetErrorMessages());
            
            var coordination = _mapper.Map<SaveCoordinationResource, Coordination>(resource);
            var result = await _coordinationService.SaveAsync(coordination);

            if(!result.Success)
                    return BadRequest(result.Message);

            var coordinationResource = _mapper.Map<Coordination, CoordinationResource>(result.Resource);
            return Ok(coordinationResource);
        }

        /// <summary>
        /// Updates an existing coordination according to an identifier.
        /// </summary>
        /// <param name="id">Coordination identifier.</param>
        /// <param name="resource">Updated coordination data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(CoordinationResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveCoordinationResource resource)
        {
            var coordination = _mapper.Map<SaveCoordinationResource, Coordination>(resource);
            var result = await _coordinationService.UpdateAsync(id, coordination);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var coordinationResource = _mapper.Map<Coordination, CoordinationResource>(result.Resource);
            return Ok(coordinationResource);
        }

        /// <summary>
        /// Updates an existing coordination according to an identifier.
        /// </summary>
        /// <param name="id">Coordination identifier.</param>
        /// <param name="patch">What attribute should be changed and the value.</param>
        /// <returns>Response for the request.</returns>
        [HttpPatch("{id}")]
        [ProducesResponseType(typeof(DatasetResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PatchAsync(int id, [FromBody] JsonPatchDocument<Coordination> patch)
        {
            if (patch != null)
            {
                var coordinationResponse = await _coordinationService.UpdateAsync(id, patch);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                var coordinationResource = _mapper.Map<Coordination, CoordinationResource>(coordinationResponse.Resource);
                return Ok(coordinationResource);
            }
            return BadRequest(ModelState);
        }
    }
}