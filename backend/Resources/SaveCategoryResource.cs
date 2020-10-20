using System.ComponentModel.DataAnnotations;

namespace OpenData.API.Resources
{
    public class SaveCategoryResource
    {
        [Required]
        [MaxLength(60)]
        public string Name { get; set; }
    }
}