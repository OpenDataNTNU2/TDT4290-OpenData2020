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

        [HttpGet]
        public async Task<IEnumerable<CoordinationResource>> GetAllAsync()
        {
            var coordinations = await _coordinationService.ListAsync();
            var resources = _mapper.Map<IEnumerable<Coordination>, IEnumerable<CoordinationResource>>(coordinations);

            return resources;
        }

        [HttpPost]
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
    }
}