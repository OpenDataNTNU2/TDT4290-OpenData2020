using System.Collections.Generic;
using OpenData.API.Domain.Models;

namespace OpenData.API.Resources
{
    public class DatasetResource
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public PublisherResource Publisher { get; set; }
        public IList<DistributionResource> Distributions { get; set; } = new List<DistributionResource>();

        public string PublicationStatus { get; set; }
        public string DetailedPublicationStatus { get; set; }

        public CategoryResource Category { get; set; }

    }
}