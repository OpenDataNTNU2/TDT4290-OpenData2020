using System.Collections.Generic;

namespace OpenData.API.Resources
{
    public class CoordinationResource
    {
        public int Id { get; set; }
        public string Title {get; set; }
        public string Description { get; set; }
        public bool UnderCoordination { get; set; }
        public string StatusDescription { get; set; }
        public PublisherResource Publisher { get; set; }
        public IList<DatasetResource> Datasets { get; set; } = new List<DatasetResource>();
        public CategoryResource Category { get; set; }
        // public IList<DatasetTagsResource> DatasetTags { get; set; } = new List<DatasetTagsResource>();
    }
}