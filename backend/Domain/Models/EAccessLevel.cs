using System.ComponentModel;

namespace OpenData.API.Domain.Models
{
    public enum EAccessLevel : byte
    {
        [Description("Green")]
        green = 1,

        [Description("Yellow")]
        yellow = 2,

        [Description("Red")]
        red = 3,
    }
}