using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Services;
using OpenData.API.Resources;
using Microsoft.AspNetCore.Cors;
using OpenData.API;
using System;
using Microsoft.AspNetCore.JsonPatch;


namespace OpenData.API.Controllers
{
    [Route("/api/datasets")]
    [Produces("application/json")]
    [ApiController]
    public class DatasetsController : Controller
    {
        private readonly IDatasetService _datasetService;
        private readonly IMapper _mapper;
        private readonly IRdfService _rdfService;

        public DatasetsController(IRdfService rdfService, IDatasetService datasetService, IMapper mapper)
        {
            _rdfService = rdfService;
            _datasetService = datasetService;
            _mapper = mapper;
        }

        /// <summary>
        /// Lists datasets from the given page.
        /// </summary>
        /// <remarks>
        /// This method uses pagination.
        /// </remarks>
        /// <param name="query">Query containing search, filters and page.</param>
        /// <returns>List of datasets.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(QueryResultResource<DatasetResource>), 200)]
        public async Task<QueryResultResource<DatasetResource>> ListAsync([FromQuery] DatasetQueryResource query)
        {
            var datasetsQuery = _mapper.Map<DatasetQueryResource, DatasetQuery>(query);
            var queryResult = await _datasetService.ListAsync(datasetsQuery);
            
            var resources = _mapper.Map<QueryResult<Dataset>, QueryResultResource<DatasetResource>>(queryResult);
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
        /// Imports a new dataset.
        /// </summary>
        /// <param name="url">URL to import from.</param>
        /// <param name="categoryId">Category Id to put the Dataset in.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost("import")]
        [ProducesResponseType(typeof(DatasetResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostImportAsync(string url, int categoryId)
        {   
            var result = await _rdfService.import(url, categoryId);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var datasetResource = _mapper.Map<Dataset, DatasetResource>(result.Resource);
            return Ok(datasetResource);
        }

        /// <summary>
        /// Populates the database with datasets from Fellesdatakatlog, data.norge.no
        /// </summary>
        /// <param name="numberOfDatasets">Number of datasets.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost("populate")]
        [ProducesResponseType(typeof(DatasetResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostPopulate(int numberOfDatasets)
        {   
            var datatset = await _rdfService.populate(numberOfDatasets);

            var datasetResource = _mapper.Map<Dataset, DatasetResource>(datatset.Resource);
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
        /// Updates an existing dataset according to an identifier.
        /// </summary>
        /// <param name="id">Dataset identifier.</param>
        /// <param name="patch">What attribute should be changed and the value.</param>
        /// <returns>Response for the request.</returns>
        [HttpPatch("{id}")]
        [ProducesResponseType(typeof(DatasetResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PatchAsync(int id, [FromBody] JsonPatchDocument<Dataset> patch)
        {
            if (patch != null)
            {
                var datasetResponse = await _datasetService.UpdateAsync(id, patch);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                var datasetResource = _mapper.Map<Dataset, DatasetResource>(datasetResponse.Resource);
                return Ok(datasetResource);
            }
            return BadRequest(ModelState);
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