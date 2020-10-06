using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class DatasetTags
    {
        public int DatasetId { get; set; }
        public Dataset Dataset { get; set; }
        public int TagsId { get; set; }
        public Tags Tags { get; set; }
    }
}