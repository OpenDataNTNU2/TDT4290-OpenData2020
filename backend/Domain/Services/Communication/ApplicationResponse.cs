using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Services.Communication
{

    public class ApplicationResponse : BaseResponse<Application>
    {

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="Application">Saved Application.</param>
        /// <returns>Response.</returns>
        public ApplicationResponse(Application Application) : base(Application)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public ApplicationResponse(string message) : base(message)
        { }
    }
}