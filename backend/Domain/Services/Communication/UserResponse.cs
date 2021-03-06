using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Services.Communication
{
    public class UserResponse : BaseResponse<User>
    {
        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="user">Saved dataset.</param>
        /// <returns>Response.</returns>
        public UserResponse(User user) : base(user)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public UserResponse(string message) : base(message)
        { }
    }
}