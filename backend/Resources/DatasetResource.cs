using System.Collections.Generic;
using Supermarket.API.Domain.Models;

namespace Supermarket.API.Resources
{
    public class DatasetResource
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public PublisherResource Publisher { get; set; }
        public IList<DistributionResource> Distributions { get; set; } = new List<DistributionResource>();

    }
}