using System.ComponentModel.DataAnnotations;

namespace Supermarket.API.Resources
{
    public class SaveDatasetResource
    {
        [Required]
        public string Identifier { get; set; }
        [Required]
        [MaxLength(60)]
        public string Title { get; set; }
        public string Description { get; set; }
    }
}