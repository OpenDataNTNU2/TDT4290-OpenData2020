using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class Subscription
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
        public int? DatasetId { get; set; }
        public Dataset Dataset { get; set; }
        public int? CoordinationId { get; set; }
        public Coordination Coordination { get; set; }
        public string Url { get; set; }
        public string UseCaseDescription { get; set; }
    }
}