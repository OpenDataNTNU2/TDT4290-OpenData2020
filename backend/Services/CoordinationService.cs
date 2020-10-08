using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Repositories;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Services.Communication;
using OpenData.API.Infrastructure;

namespace OpenData.API.Services
{
    public class CoordinationService : ICoordinationService
    {
        private readonly ICoordinationRepository _coordinationRepository;

        public CoordinationService(ICoordinationRepository coordinationRepository)
        {
            _coordinationRepository = coordinationRepository;
        }
        public async Task<IEnumerable<Coordination>> ListAsync()
        {
            return await _coordinationRepository.ListAsync();
        }
    }
}