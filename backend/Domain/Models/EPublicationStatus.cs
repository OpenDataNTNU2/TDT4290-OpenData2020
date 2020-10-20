using System.ComponentModel;

namespace OpenData.API.Domain.Models
{
    public enum EPublicationStatus : byte
    {
        [Description("Published")]
        published = 1,

        [Description("Planned published")]
        plannedPublished = 2,

        [Description("Not published")]
        notPublished = 3,
    }
}