using System.Collections.Generic;
using OpenData.API.Domain.Models;

namespace OpenData.API.Resources
{
    public class PublisherResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<DatasetResource> Datasets { get; set; } = new List<DatasetResource>();
        public IList<Coordination> Coordinations { get; set; } = new List<Coordination>();

    }
}