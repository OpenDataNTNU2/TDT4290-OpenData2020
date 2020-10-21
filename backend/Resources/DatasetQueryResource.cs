namespace OpenData.API.Resources
{
    public class DatasetQueryResource : QueryResource
    {
        public string Search { get; set; }
        public string PublisherIds { get; set; }
        public string CategoryIds { get; set; }
        public string AccessLevels {get; set; }
    }
}