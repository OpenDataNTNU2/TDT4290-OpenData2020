using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? BroaderId { get; set; }
        public Category Broader { get; set; }
        public IList<Category> Narrower { get; set; } = new List<Category>();
        public IList<Dataset> Datasets { get; set; } = new List<Dataset>();


    }
}