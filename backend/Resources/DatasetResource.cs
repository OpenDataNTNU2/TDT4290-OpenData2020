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
        
        public IList<Distribution> Distributions { get; set; } = new List<Distribution>();

    }
}