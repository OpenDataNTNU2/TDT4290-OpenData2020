using System.Collections.Generic;
using Supermarket.API.Domain.Models;

namespace Supermarket.API.Resources
{
    public class PublisherResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<DatasetResource> Datasets { get; set; } = new List<DatasetResource>();

    }
}