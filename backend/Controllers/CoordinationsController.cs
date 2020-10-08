using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Services;
using OpenData.API.Resources;
using Microsoft.AspNetCore.Cors;

namespace OpenData.API.Controllers
{
    [Route("/api/coordinations")]
    [Produces("application/json")]
    [ApiController]

    public class CoordinationsController : Controller
    {
        private readonly ICoordinationService _coordinationService;
        
        public CoordinationController(ICoordinationService coordinationService)
        {
            _coordinationService = coordinationService;   
        }

        [HttpGet]
        public async Task<IEnumerable<Coordination>> GetAllAsync()
        {
            var coordinations = await _coordinationService.ListAsync();
            return coordinations;
        }
    }
}