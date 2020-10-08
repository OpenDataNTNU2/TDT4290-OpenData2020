using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
    public class Dataset
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int PublisherId { get; set; }
        public Publisher Publisher { get; set; }
        public IList<Distribution> Distributions { get; set; } = new List<Distribution>();

        public EPublicationStatus PublicationStatus { get; set; }
        public EDetailedPublicationStatus DetailedPublicationStatus { get; set; }
        public EAccessLevel AccessLevel { get; set; }

        public string TagsIds { get; set; }
        public IList<DatasetTags> DatasetTags { get; set; } = new List<DatasetTags>();
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public int CoordinationId { get; set; }
        public Coordination Coordination { get; set; }

    }
}