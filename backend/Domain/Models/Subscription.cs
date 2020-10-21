using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class Subscription
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int DatasetId { get; set; }
        public Dataset Dataset { get; set; }
    }
}