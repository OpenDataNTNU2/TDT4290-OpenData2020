using OpenData.API.Domain.Models;

namespace OpenData.API.Domain.Services.Communication
{
    public class DistributionResponse : BaseResponse<Distribution>
    {
        public DistributionResponse(Distribution distribution) : base(distribution) { }

        public DistributionResponse(string message) : base(message) { }
    }
}