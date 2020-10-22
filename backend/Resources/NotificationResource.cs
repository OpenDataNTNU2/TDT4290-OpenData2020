using System;
namespace OpenData.API.Resources
{

    public class NotificationResource
    {
        public int Id { get; set; }
        public int DatasetId { get; set; }
        public int CoordinationId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime TimeOfCreation { get; set; }
    }
}