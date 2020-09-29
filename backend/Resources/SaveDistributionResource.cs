using System.ComponentModel.DataAnnotations;
using Supermarket.API.Domain.Models;


namespace Supermarket.API.Resources
{
    public class SaveDistributionResource
    {
        [Required]
        [MaxLength(60)]
        public string Title { get; set; }
        [Required]
        public string Uri { get; set; }

        [Range(1, 2)]
        public int FileFormat { get; set; }
        public int DatasetId {get;set;}

    }
}