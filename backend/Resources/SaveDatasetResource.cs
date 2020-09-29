using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Supermarket.API.Domain.Models;


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
        public int PublicationStatus { get; set; }


    }
}