using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Services.Communication
{
    public class DatasetResponse : BaseResponse<Dataset>
    {
        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="dataset">Saved dataset.</param>
        /// <returns>Response.</returns>
        public DatasetResponse(Dataset dataset) : base(dataset)
        { }

        /// <summary>
        /// Creates am error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public DatasetResponse(string message) : base(message)
        { }
    }
}