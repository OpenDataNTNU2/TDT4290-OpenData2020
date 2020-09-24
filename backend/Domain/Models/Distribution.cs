namespace Supermarket.API.Domain.Models
{
    public class Distribution
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string Uri { get; set; }

        public int DatasetId { get; set; }
        
        public EFileFormat FileFormat { get; set; }

        public Dataset Dataset { get; set; }
    }
}