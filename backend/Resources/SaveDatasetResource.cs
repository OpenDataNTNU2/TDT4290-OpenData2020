using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using OpenData.API.Domain.Models;


namespace OpenData.API.Resources
{
    public class SaveDatasetResource
    {
        [Required]
        public string Identifier { get; set; }
        [Required]
        [MaxLength(60)]
        public string Title { get; set; }
        public string Description { get; set; }
        public int PublisherId { get; set; }
        public int PublicationStatus { get; set; }
        public int DetailedPublicationStatus { get; set; }
        public int CategoryId { get; set; }

    }
}