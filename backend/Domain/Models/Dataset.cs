using System.Collections.Generic;

namespace Supermarket.API.Domain.Models
{
    public class Dataset
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public IList<Distribution> Distributions { get; set; } = new List<Distribution>();

    }
}