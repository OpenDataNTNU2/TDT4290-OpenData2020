using System.ComponentModel;

namespace OpenData.API.Domain.Models
{
    public enum EPublicationStatus : byte
    {
        [Description("Published")]
        published = 1,

        [Description("Not published")]
        notPublished = 2,
    }
}