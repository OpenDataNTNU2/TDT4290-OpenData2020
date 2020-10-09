using System.ComponentModel;

namespace OpenData.API.Domain.Models
{
    public enum EFileFormat : byte
    {
        [Description("json")]
        json = 1,

        [Description("xml")]
        xml = 2,
        
        [Description("annet")]
        annet = 3,
        
        [Description("pdf")]
        pdf = 4,

        [Description("csv")]
        csv = 5,
    }
}