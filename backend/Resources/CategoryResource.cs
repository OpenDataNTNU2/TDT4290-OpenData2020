using System.Collections.Generic;

namespace OpenData.API.Resources
{
    public class CategoryResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public CategoryResource Broader { get; set; }
        public IList<CategoryResource> Narrower { get; set; } = new List<CategoryResource>();
        public IList<DatasetResource> Datasets { get; set; } = new List<DatasetResource>();
    }
}