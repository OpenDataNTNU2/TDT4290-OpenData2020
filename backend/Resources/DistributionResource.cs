using OpenData.API.Domain.Models;

namespace OpenData.API.Resources
{
    public class DistributionResource
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Uri { get; set; }
        public string FileFormat { get; set; }
        // public DatasetResource Dataset {get;set;}
    }
}