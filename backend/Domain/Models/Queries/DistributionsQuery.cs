namespace Supermarket.API.Domain.Models.Queries
{
    public class DistributionQuery : Query
    {
        public int? DatasetId { get; set; }

        public DistributionQuery(int? datasetId, int page, int itemsPerPage) : base(page, itemsPerPage)
        {
            DatasetId = datasetId;
        }
    }
}