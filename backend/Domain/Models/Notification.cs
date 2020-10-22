using System.Collections.Generic;
using System;

namespace OpenData.API.Domain.Models
{
    public class Notification
    {

        public int Id { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
        public int? DatasetId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime TimeOfCreation { get; set; }
        
    }
}