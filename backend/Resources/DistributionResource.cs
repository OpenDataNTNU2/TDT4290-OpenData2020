namespace Supermarket.API.Resources
{
    public class DistributionResource
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DatasetResource Dataset {get;set;}
    }
}