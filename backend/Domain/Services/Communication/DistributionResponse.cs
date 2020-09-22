using Supermarket.API.Domain.Models;

namespace Supermarket.API.Domain.Services.Communication
{
    public class DistributionResponse : BaseResponse<Distribution>
    {
        public DistributionResponse(Distribution distribution) : base(distribution) { }

        public DistributionResponse(string message) : base(message) { }
    }
}