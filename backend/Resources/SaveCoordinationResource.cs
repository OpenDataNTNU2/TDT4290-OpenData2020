using System.ComponentModel.DataAnnotations;

namespace OpenData.API.Resources
{
    public class SaveCoordinationResource
    {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public int? PublisherId { get; set; }
        
    }
}