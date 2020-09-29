using System.Collections.Generic;
using Supermarket.API.Domain.Models;

namespace Supermarket.API.Resources
{
    public class UserResource
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public Publisher Publisher { get; set; }


    }
}