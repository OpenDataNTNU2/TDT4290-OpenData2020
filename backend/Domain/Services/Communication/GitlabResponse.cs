using OpenData.External.Gitlab.Models;


namespace OpenData.API.Domain.Services.Communication
{
    public class GitlabResponse : BaseResponse<GitlabProject>
    {
        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="gitlabProject">Saved publisher.</param>
        /// <returns>Response.</returns>
        public GitlabResponse(GitlabProject gitlabProject) : base(gitlabProject)
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