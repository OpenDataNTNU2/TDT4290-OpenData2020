using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using OpenData.API.Domain.Models;
using System;

namespace OpenData.API.Resources
{
    public class SaveDatasetResource
    {
        [Required]
        // [Url]
        public string Identifier { get; set; }
        [Required]
        [MaxLength(60)]
        public string Title { get; set; }
        public string Description { get; set; }
        [Required]
        public int? PublisherId { get; set; }
        [Range(1, 3)]
        public int PublicationStatus { get; set; }
        public Nullable<DateTime> DatePlannedPublished {get; set; }
        [Range(1, 3)]
        public int AccessLevel { get; set; }
        public string TagsIds { get; set; }
        [Required]
        public int? CategoryId { get; set; }
        public int? CoordinationId { get; set; }
        public int? InterestCounter { get; set; }

    }
}