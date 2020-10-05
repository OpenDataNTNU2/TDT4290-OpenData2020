using System.ComponentModel.DataAnnotations;
using OpenData.API.Domain.Models;


namespace OpenData.API.Resources
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
        [Required]
        public int? DatasetId {get;set;}

    }
}