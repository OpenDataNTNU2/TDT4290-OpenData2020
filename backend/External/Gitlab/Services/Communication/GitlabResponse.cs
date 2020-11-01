using OpenData.External.Gitlab.Models;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.External.Gitlab.Services.Communication
{
    public class GitlabResponse<T> : BaseResponse<T>
    {
        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="gitlabObject">Saved gitlab object.</param>
        /// <returns>Response.</returns>
        public GitlabResponse(T gitlabObject) : base(gitlabObject)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public GitlabResponse(string message) : base(message)
        { }
    }
}