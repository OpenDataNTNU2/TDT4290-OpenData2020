using System.Collections.Generic;
using OpenData.API.Domain.Models;
using System;

namespace OpenData.API.Resources
{
    public class DatasetResource
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DateLastUpdated {get; set; }
        public DateTime DatePublished {get; set; }
        public PublisherResource Publisher { get; set; }
        public IList<DistributionResource> Distributions { get; set; } = new List<DistributionResource>();
        public string PublicationStatus { get; set; }
        public Nullable<DateTime> DatePlannedPublished {get; set; }
        public string AccessLevel { get; set; }
        public IList<DatasetTagsResource> DatasetTags { get; set; } = new List<DatasetTagsResource>();
        public CategoryResource Category { get; set; }
        public int InterestCounter { get; set; }
        public CoordinationResource Coordination { get; set; }
        public IList<SubscriptionResource> Subscriptions { get; set; } = new List<SubscriptionResource>();

    }
}