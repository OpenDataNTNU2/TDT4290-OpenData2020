namespace OpenData.API.Domain.Models.Queries
{
    public class CoordinationQuery : Query
    {
        public string Search { get; set; }
        public string PublisherIds { get; set; }
        public string CategoryIds { get; set; }

        public CoordinationQuery(string search, string publisherIds, string categoryIds, int page, int itemsPerPage) : base(page, itemsPerPage)
        {
            Search = search;
            PublisherIds = publisherIds;
            CategoryIds = categoryIds;
        }
    }
}