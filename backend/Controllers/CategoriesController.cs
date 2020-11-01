using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Resources;
using OpenData.API.Extensions;
using System;

namespace OpenData.API.Controllers
{
    [Route("/api/categories")]
    [Produces("application/json")]
    [ApiController]
    public class CategoriesController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly IMapper _mapper;
        private readonly IRdfService _rdfService;

        public CategoriesController(ICategoryService categoryService, IMapper mapper, IRdfService rdfService)
        {
            _categoryService = categoryService;
            _mapper = mapper;
            _rdfService = rdfService;
        }

        /// <summary> Lists all Categories </summary>
        /// <returns> List of categories </returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CategoryResource>), 200)]
        public async Task<IEnumerable<CategoryResource>> ListAsync()
        {
            var categories = await _categoryService.ListAsync();
            var resources = _mapper.Map<IEnumerable<Category>, IEnumerable<CategoryResource>>(categories);

            return resources;
        }

        /// <summary> Saves new category </summary>
        /// <param name="resource">Category data.</param>
        /// <returns> Response of request </returns>
        [HttpPost]
        [ProducesResponseType(typeof(IEnumerable<CategoryResource>), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SaveCategoryResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var category = _mapper.Map<SaveCategoryResource, Category>(resource);

            var result = await _categoryService.SaveAsync(category);

            if (!result.Success)
                return BadRequest(result.Message);

            var categoryResource = _mapper.Map<Category, CategoryResource>(result.Resource);
            return Ok(categoryResource);


        }

        /// <summary>
        /// Imports a new categories.
        /// </summary>
        /// <param name="url">URL to import from.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost("import")]
        [ProducesResponseType(typeof(DatasetResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostImportAsync(string url)
        {   
            if (await _rdfService.importCategories(url)) {
                return Ok("Categories added to database.");
            }
            return BadRequest("Could not import categories from url.");
        }
    }
}