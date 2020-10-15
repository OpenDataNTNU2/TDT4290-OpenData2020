using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class CoordinationTags
    {
        public int CoordinationId { get; set; }
        public Coordination Coordination { get; set; }
        public int TagsId { get; set; }
        public Tags Tags { get; set; }
    }
}