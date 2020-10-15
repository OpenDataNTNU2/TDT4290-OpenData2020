namespace OpenData.API.Resources
{
    public class CoordinationQueryResource : QueryResource
    {
        public string Search { get; set; }
        public string PublisherIds { get; set; }
        public string CategoryIds { get; set; }
    }
}