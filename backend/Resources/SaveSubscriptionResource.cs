using System.Collections.Generic;
using OpenData.API.Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace OpenData.API.Resources
{
    public class SaveSubscriptionResource
    {
        public int UserId { get; set; }
        public int DatasetId { get; set; }
        public int CoordinationId { get; set; }
        public string Url { get; set; }
        public string UseCaseDescription { get; set; }
    }
}