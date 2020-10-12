using System.Collections.Generic;
using Newtonsoft.Json;

namespace OpenData.API.Resources
{
    public class CategoryResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<DatasetResource> Datasets { get; set; } = new List<DatasetResource>();
    }
}