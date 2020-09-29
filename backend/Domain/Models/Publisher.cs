using System.Collections.Generic;

namespace Supermarket.API.Domain.Models
{
    public class Publisher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<Dataset> Datasets { get; set; } = new List<Dataset>();

    }
}