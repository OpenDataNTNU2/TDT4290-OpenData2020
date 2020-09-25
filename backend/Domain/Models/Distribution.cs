namespace Supermarket.API.Domain.Models
{
    public class Distribution
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public int DatasetId { get; set; }

        public Dataset Dataset { get; set; }
        
    }
}