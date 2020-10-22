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
using OpenData.API.Domain.Repositories;


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
        private readonly IUnitOfWork _unitOfWork;

        public DatasetsController(IRdfService rdfService, IDatasetService datasetService, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _rdfService = rdfService;
            _datasetService = datasetService;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Lists all datasets.
        /// </summary>
        /// <returns>List os datasets.</returns>
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

        [HttpPost("import")]
        [ProducesResponseType(typeof(DatasetResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostImportAsync(string url, int categoryId)
        {   
            Dataset datatset = await _rdfService.import(url, categoryId);

            var datasetResource = _mapper.Map<Dataset, DatasetResource>(datatset);
            return Ok(datasetResource);
        }

        [HttpPost("populate")]
        [ProducesResponseType(typeof(DatasetResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostPopulate(int numberOfDatasets)
        {   
            Dataset datatset = await _rdfService.populate(numberOfDatasets);

            var datasetResource = _mapper.Map<Dataset, DatasetResource>(datatset);
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

        [HttpPatch("{id}")]
        [ProducesResponseType(typeof(DatasetResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PatchAsync(int id, [FromBody] JsonPatchDocument<Dataset> patch)
        {
            if (patch != null)
            {
                var datasetResponse = await _datasetService.FindByIdAsync(id);
                Dataset dataset = datasetResponse.Resource;
                patch.ApplyTo(dataset, ModelState);

                await _unitOfWork.CompleteAsync();

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                Console.WriteLine(patch.ToString());
                await _datasetService.AddUserNotificationsAsync(dataset, "Datasettet '" + dataset.Title + "' har blitt med i en samordning.");
                await _datasetService.AddPublisherNotificationsAsync(dataset, "Datasettet ditt '" + dataset.Title + "' har blitt med i en samordning.");

                var datasetResource = _mapper.Map<Dataset, DatasetResource>(dataset);
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