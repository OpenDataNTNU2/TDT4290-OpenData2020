namespace OpenData.API.Resources
{

    public class SubscriptionResource
    {
        public int DatasetId { get; set; }
        public string Url { get; set; }
        public string UseCaseDescription { get; set; }
        public int CoordinationId { get; set; }
    }
}