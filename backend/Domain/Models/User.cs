using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int? PublisherId { get; set; }
        public IList<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public IList<Notification> Notifications { get; set; } = new List<Notification>();

    }
}