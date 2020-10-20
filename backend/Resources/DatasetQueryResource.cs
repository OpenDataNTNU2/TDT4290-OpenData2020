namespace OpenData.API.Resources
{
    public class DatasetQueryResource : QueryResource
    {
        public string Search { get; set; }
        public string PublisherIds { get; set; }
    }
}