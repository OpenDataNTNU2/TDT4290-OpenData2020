

namespace OpenData.API.Domain.Models
{
    public class Application
    {
        public int Id { get; set; }
        public string Reason { get; set; }
        public int DatasetId { get; set; }
        public Dataset Dataset { get; set; }
        public int CoordinationId { get; set; }
        public Coordination Coordination { get; set; }
        public int PublisherId { get; set; }
        public Publisher Publisher { get; set; }
    }
}