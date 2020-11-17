using System.Collections.Generic;
using System;

namespace OpenData.API.Domain.Models
{
    public interface ICatalogueItem
    {
        int Id { get; set; }
        string Title { get; set; }
        string Description { get; set; }
        int PublisherId { get; set; }
        Publisher Publisher { get; set; }
        int CategoryId { get; set; }
        Category Category { get; set; }
        IList<Application> Applications { get; set; } 
        IList<Subscription> Subscriptions { get; set; }
        int? GitlabProjectId { get; set; }
        string GitlabProjectPath { get; set; }
        int? GitlabDiscussionBoardId { get; set; }

    }
}