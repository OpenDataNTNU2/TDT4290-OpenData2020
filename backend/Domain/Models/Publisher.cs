using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class Publisher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<Dataset> Datasets { get; set; } = new List<Dataset>();
        public IList<Coordination> Coordinations { get; set; } = new List<Coordination>();
        public IList<Application> Applications { get; set; } = new List<Application>();

    }
}