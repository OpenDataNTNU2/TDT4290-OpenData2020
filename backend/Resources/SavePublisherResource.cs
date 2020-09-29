using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Supermarket.API.Domain.Models;


namespace Supermarket.API.Resources
{
    public class SavePublisherResource
    {
        [Required]
        [MaxLength(60)]
        public string Name { get; set; }

    }
}