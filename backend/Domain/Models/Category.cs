using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<Dataset> Datasets { get; set; } = new List<Dataset>();

    }
}