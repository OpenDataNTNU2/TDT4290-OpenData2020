using OpenData.External.Gitlab.Models;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.External.Gitlab.Services.Communication
{
    public class GitlabProjectResponse : BaseResponse<GitlabProject>
    {
        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="gitlabProject">Saved publisher.</param>
        /// <returns>Response.</returns>
        public GitlabProjectResponse(GitlabProject gitlabProject) : base(gitlabProject)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public GitlabProjectResponse(string message) : base(message)
        { }
    }
}