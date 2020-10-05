namespace OpenData.API.Domain.Models.Queries
{
    public class DatasetQuery : Query
    {
        public string Search { get; set; }

        public DatasetQuery(string search, int page, int itemsPerPage) : base(page, itemsPerPage)
        {
            Search = search;
        }
    }
}