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
    [Route("/api/applications")]
    [Produces("application/json")]
    [ApiController]

    public class ApplicationsController : Controller
    {
        private readonly IApplicationService _applicationService;
        private readonly IMapper _mapper;
        public ApplicationsController(IApplicationService applicationService, IMapper mapper)
        {
            _applicationService = applicationService;
            _mapper = mapper;
        }

        /// <summary>
        /// Lists all existing applications.
        /// </summary>
        /// <returns>List of applications.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ApplicationResource>), 200)]
        public async Task<IEnumerable<ApplicationResource>> GetAllAsync()
        {
            var application = await _applicationService.ListAsync();
            var resources = _mapper.Map<IEnumerable<Application>, IEnumerable<ApplicationResource>>(application);

            return resources;
        }

        /// <summary>
        /// Find one application by id.
        /// </summary>
        /// <param name="id">Application identifier.</param>
        /// <returns>Application found by id.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApplicationResource), 200)]
        public async Task<ApplicationResource> FindByIdAsync(int id)
        {
            var application = await _applicationService.FindByIdAsync(id);
            var resource = _mapper.Map<Application, ApplicationResource>(application.Resource);

            return resource;
        }

        /// <summary>
        /// Saves a new application.
        /// </summary>
        /// <param name="resource">Application data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ApplicationResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SaveApplicationResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var application = _mapper.Map<SaveApplicationResource, Application>(resource);
            var result = await _applicationService.SaveAsync(application);

            if (!result.Success)
                return BadRequest(result.Message);

            var applicationResource = _mapper.Map<Application, ApplicationResource>(result.Resource);
            return Ok(applicationResource);
        }

        /// <summary>
        /// Updates an existing application according to an identifier.
        /// </summary>
        /// <param name="id">Application identifier.</param>
        /// <param name="resource">Application data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApplicationResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveApplicationResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var application = _mapper.Map<SaveApplicationResource, Application>(resource);
            var result = await _applicationService.UpdateAsync(id, application);

            if (!result.Success)
                return BadRequest(result.Message);

            var applicationResource = _mapper.Map<Application, ApplicationResource>(result.Resource);
            return Ok(applicationResource);
        }

        /// <summary>
        /// Deletes a given application according to an identifier.
        /// </summary>
        /// <param name="id">Application identifier.</param>
        /// <returns>Response for the request.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApplicationResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _applicationService.DeleteAsync(id);

            if (!result.Success)
                return BadRequest(result.Message);

            var applicationResource = _mapper.Map<Application, ApplicationResource>(result.Resource);
            return Ok(applicationResource);
        }
    }
}