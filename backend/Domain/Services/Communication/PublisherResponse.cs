using Supermarket.API.Domain.Models;

namespace Supermarket.API.Domain.Services.Communication
{
    public class PublisherResponse : BaseResponse<Publisher>
    {
        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="publisher">Saved publisher.</param>
        /// <returns>Response.</returns>
        public PublisherResponse(Publisher publisher) : base(publisher)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public PublisherResponse(string message) : base(message)
        { }
    }
}