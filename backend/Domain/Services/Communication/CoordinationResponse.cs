using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Services.Communication
{
    public class CoordinationResponse : BaseResponse<Coordination>
    {
        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="coordination">Saved Coordination.</param>
        /// <returns>Response.</returns>
        public CoordinationResponse(Coordination coordination) : base(coordination)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public CoordinationResponse(string message) : base(message)
        { }
    }
}