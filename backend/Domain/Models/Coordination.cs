using System.Collections.Generic;
using System;
namespace OpenData.API.Domain.Models
{
    public class Coordination : ICatalogueItem
    {
        public int Id { get; set; }
        public string Title { get; set;}
        public string Description { get; set; }
        public bool UnderCoordination { get; set; }
        public string StatusDescription { get; set; }
        public int PublisherId { get; set; }
        public Publisher Publisher { get; set; }
        public DateTime DateLastUpdated {get; set; }
        public DateTime DatePublished {get; set; }
        public IList<Dataset> Datasets { get; set; } = new List<Dataset>();
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public string TagsIds { get; set; }
        public IList<CoordinationTags> CoordinationTags { get; set; } = new List<CoordinationTags>();
        public IList<Application> Applications { get; set; } = new List<Application>();
        public IList<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    }
}