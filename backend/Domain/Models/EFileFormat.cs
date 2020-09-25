using System.ComponentModel;

namespace Supermarket.API.Domain.Models
{
    public enum EFileFormat : byte
    {
        [Description("json")]
        json = 1,

        [Description("xml")]
        xml = 2,
    }
}