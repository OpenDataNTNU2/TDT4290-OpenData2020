namespace OpenData.API.Resources
{
    public class CoordinationQueryResource : QueryResource
    {
        public string Search { get; set; }
        public string PublisherIds { get; set; }
        public string CategoryIds { get; set; }
        public string AccessLevels {get; set; }
        public string PublicationStatuses {get; set; }
        public string SortOrder {get; set; }
    }
}