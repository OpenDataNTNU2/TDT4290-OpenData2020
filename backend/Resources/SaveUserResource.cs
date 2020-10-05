using System.Collections.Generic;
using OpenData.API.Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace OpenData.API.Resources
{
    public class SaveUserResource
    {
        [Required]
        public string Username { get; set; }
        public int? PublisherId { get; set; }
    }
}