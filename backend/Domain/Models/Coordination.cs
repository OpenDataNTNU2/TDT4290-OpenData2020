using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class Coordination
    {
        public int Id { get; set; }
        public string Title { get; set;}
        public string Description { get; set; }
        public int? PublisherId { get; set; }
        public Publisher Publisher { get; set; }
        public IList<Dataset> Datasets { get; set; } = new List<Dataset>();
    }
}