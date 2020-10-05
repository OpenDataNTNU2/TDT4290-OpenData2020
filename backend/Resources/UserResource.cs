using System.Collections.Generic;
using OpenData.API.Domain.Models;

namespace OpenData.API.Resources
{
    public class UserResource
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int? PublisherId { get; set; }


    }
}