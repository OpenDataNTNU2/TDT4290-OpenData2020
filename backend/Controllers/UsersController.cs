using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services;
using OpenData.API.Resources;
using Microsoft.AspNetCore.Cors;

namespace OpenData.API.Controllers
{
    [Route("/api/users")]
    [Produces("application/json")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        /// <summary>
        /// Lists all users.
        /// </summary>
        /// <returns>List of users.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserResource>), 200)]
        public async Task<IEnumerable<UserResource>> ListAsync()
        {
            var users = await _userService.ListAsync();
            var resources = _mapper.Map<IEnumerable<User>, IEnumerable<UserResource>>(users);

            return resources;
        }

        /// <summary>
        /// Find one user by id.
        /// </summary>
        /// <param name="username">Username.</param>
        /// <returns>User found by username.</returns>
        [HttpGet("{username}")]
        [ProducesResponseType(typeof(UserResource), 200)]
        public async Task<UserResource> FindByUsernameAsync(string username)
        {
            var user = await _userService.FindByUsernameAsync(username);
            var resource = _mapper.Map<User, UserResource>(user.Resource);

            return resource;
        }

        /// <summary>
        /// Saves a new user.
        /// </summary>
        /// <param name="resource">User data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(UserResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SaveUserResource resource)
        {
            var user = _mapper.Map<SaveUserResource, User>(resource);
            var result = await _userService.SaveAsync(user);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var userResource = _mapper.Map<User, UserResource>(result.Resource);
            return Ok(userResource);
        }

        /// <summary>
        /// Updates an existing user according to an identifier.
        /// </summary>
        /// <param name="username">Username.</param>
        /// <param name="resource">Updated user data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPut("{username}")]
        [ProducesResponseType(typeof(UserResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PutAsync(string username, [FromBody] SaveUserResource resource)
        {
            var user = _mapper.Map<SaveUserResource, User>(resource);
            var result = await _userService.UpdateAsync(username, user);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var userResource = _mapper.Map<User, UserResource>(result.Resource);
            return Ok(userResource);
        }

        /// <summary>
        /// Subscribes a user to a dataset og coordination
        /// </summary>
        /// <param name="resource">Subscription containing User Id and Dataset/Coordination Id.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost("subscribe")]
        [ProducesResponseType(typeof(DatasetResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostSubscribe([FromBody] SaveSubscriptionResource resource)
        {   
            var subscription = _mapper.Map<SaveSubscriptionResource, Subscription>(resource);
            var result = await _userService.SubscribeAsync(subscription);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var userResource = _mapper.Map<User, UserResource>(result.Resource);
            return Ok(userResource);
        }

        /// <summary>
        /// Deletes a given user according to an identifier.
        /// </summary>
        /// <param name="id">User identifier.</param>
        /// <returns>Response for the request.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(UserResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _userService.DeleteAsync(id);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var userResource = _mapper.Map<User, UserResource>(result.Resource);
            return Ok(userResource);
        }
    }
}