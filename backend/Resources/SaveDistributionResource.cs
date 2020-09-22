using System.ComponentModel.DataAnnotations;

namespace Supermarket.API.Resources
{
    public class SaveDistributionResource
    {
        [Required]
        [MaxLength(60)]
        public string Title { get; set; }

        public int DatasetId {get;set;}
    }
}