using System.Collections.Generic;
using OpenData.API.Domain.Models;

namespace OpenData.API.Resources
{
    public class PublisherResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DatasetsCount { get; set; }
        public int CoordinationsCount { get; set; }

    }
}