using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using OpenData.API.Domain.Models;


namespace OpenData.API.Resources
{
    public class SavePublisherResource
    {
        [Required]
        [MaxLength(60)]
        public string Name { get; set; }

    }
}