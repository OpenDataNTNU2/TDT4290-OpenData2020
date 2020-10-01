using System.ComponentModel.DataAnnotations;

namespace OpenData.API.Resources
{

    public class SaveTagsResource
    {
        [Required]
        public string Name { get; set; }
    }
}