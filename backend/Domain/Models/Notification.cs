using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class Notification
    {

        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int DatasetId { get; set; }
        public string Content { get; set; }

        
    }
}