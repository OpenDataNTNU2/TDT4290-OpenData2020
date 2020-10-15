using System.ComponentModel.DataAnnotations;

namespace OpenData.API.Resources
{
    public class SaveCoordinationResource
    {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        [Required]
        public int? PublisherId { get; set; }
        [Required]
        public bool UnderCoordination { get; set; }
        public string StatusDescription { get; set; }
        [Required]
        public int CategoryId { get; set; }
        public string TagsIds { get; set; }
        
    }
}