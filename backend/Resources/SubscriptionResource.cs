namespace OpenData.API.Resources
{

    public class SubscriptionResource
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DatasetId { get; set; }
        public string Url { get; set; }
        public string UseCaseDescription { get; set; }
        public int CoordinationId { get; set; }
    }
}