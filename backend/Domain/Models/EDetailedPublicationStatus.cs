using System.ComponentModel;

namespace Supermarket.API.Domain.Models
{
    public enum EDetailedPublicationStatus : byte
    {
        [Description("Will be published")]
        willBePublished = 1,

        [Description("Under evaluation")]
        underEvaluation = 2,

        [Description("Cannot publish")]
        cannotPublish = 3,
    }
}