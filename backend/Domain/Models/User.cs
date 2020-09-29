using System.Collections.Generic;

namespace Supermarket.API.Domain.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int PublisherId { get; set; }
        public Publisher Publisher { get; set; }

    }
}