namespace OpenData.API.Domain.Models.Queries
{
    public class DatasetQuery : Query
    {
        public string Search { get; set; }
        public string PublisherIds { get; set; }
        public string CategoryIds { get; set; }
        public string AccessLevels { get; set; }
        public string PublicationStatuses {get; set; }

        public DatasetQuery(string search, string publisherIds, string categoryIds,  string accessLevels, string publicationstatuses, int page, int itemsPerPage) : base(page, itemsPerPage)
        {
            Search = search;
            PublisherIds = publisherIds;
            CategoryIds = categoryIds;
            AccessLevels = accessLevels;
            PublicationStatuses = publicationstatuses;
        }
    }
}