using System.ComponentModel.DataAnnotations;

namespace OpenData.API.Resources
{

    public class SaveApplicationResource
    {
        [Required]
        public string Reason { get; set; }
        [Required]
        public int? CoordinationId { get; set; }
        [Required]
        public int? DatasetId { get; set; }
    }
}