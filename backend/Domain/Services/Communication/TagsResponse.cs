using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Services.Communication
{

    public class TagsResponse : BaseResponse<Tags>
    {

        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="tags">Saved category.</param>
        /// <returns>Response.</returns>
        public TagsResponse(Tags tags) : base(tags)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public TagsResponse(string message) : base(message)
        { }
    }
}