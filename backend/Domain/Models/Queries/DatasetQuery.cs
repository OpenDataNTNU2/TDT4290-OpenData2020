namespace OpenData.API.Domain.Models.Queries
{
    public class DatasetQuery : Query
    {
        public string Search { get; set; }
        public string PublisherIds { get; set; }

        public DatasetQuery(string search, string publisherIds, int page, int itemsPerPage) : base(page, itemsPerPage)
        {
            Search = search;
            PublisherIds = publisherIds;
        }
    }
}