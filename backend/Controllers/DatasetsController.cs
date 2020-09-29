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
    [Route("/api/datasets")]
    [Produces("application/json")]
    [ApiController]
    public class DatasetsController : Controller
    {
        private readonly IDatasetService _datasetService;
        private readonly IMapper _mapper;

        public DatasetsController(IDatasetService datasetService, IMapper mapper)
        {
            _datasetService = datasetService;
            _mapper = mapper;
        }

        /// <summary>
        /// Lists all datasets.
        /// </summary>
        /// <returns>List os datasets.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<DatasetResource>), 200)]
        public async Task<IEnumerable<DatasetResource>> ListAsync()
        {
            var datasets = await _datasetService.ListAsync();
            var resources = _mapper.Map<IEnumerable<Dataset>, IEnumerable<DatasetResource>>(datasets);

            return resources;
        }

        /// <summary>
        /// Find one dataset by id.
        /// </summary>
        /// <param name="id">Dataset identifier.</param>
        /// <returns>Dataset found by id.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DatasetResource), 200)]
        public async Task<DatasetResource> FindByIdAsync(int id)
        {
            var dataset = await _datasetService.FindByIdAsync(id);
            var resource = _mapper.Map<Dataset, DatasetResource>(dataset.Resource);

            return resource;
        }
        

        /// <summary>
        /// Saves a new dataset.
        /// </summary>
        /// <param name="resource">Dataset data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(DatasetResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SaveDatasetResource resource)
        {
            var dataset = _mapper.Map<SaveDatasetResource, Dataset>(resource);
            var result = await _datasetService.SaveAsync(dataset);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var datasetResource = _mapper.Map<Dataset, DatasetResource>(result.Resource);
            return Ok(datasetResource);
        }

        /// <summary>
        /// Updates an existing dataset according to an identifier.
        /// </summary>
        /// <param name="id">Dataset identifier.</param>
        /// <param name="resource">Updated dataset data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(DatasetResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveDatasetResource resource)
        {
            var dataset = _mapper.Map<SaveDatasetResource, Dataset>(resource);
            var result = await _datasetService.UpdateAsync(id, dataset);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var datasetResource = _mapper.Map<Dataset, DatasetResource>(result.Resource);
            return Ok(datasetResource);
        }

        /// <summary>
        /// Deletes a given dataset according to an identifier.
        /// </summary>
        /// <param name="id">Dataset identifier.</param>
        /// <returns>Response for the request.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(DatasetResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _datasetService.DeleteAsync(id);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var datasetResource = _mapper.Map<Dataset, DatasetResource>(result.Resource);
            return Ok(datasetResource);
        }
    }
}