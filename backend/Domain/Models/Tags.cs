using System.Collections.Generic;


namespace OpenData.API.Domain.Models
{
    public class Tags
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<DatasetTags> DatasetTags { get; set; } 
        public ICollection<CoordinationTags> CoordinationTags { get; set; } 
    }
}