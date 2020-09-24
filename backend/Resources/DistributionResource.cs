using Supermarket.API.Domain.Models;

namespace Supermarket.API.Resources
{
    public class DistributionResource
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Uri { get; set; }
        public EFileFormat FileFormat { get; set; }
        public DatasetResource Dataset {get;set;}
    }
}