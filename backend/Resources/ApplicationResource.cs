using System.Collections.Generic;
using OpenData.API.Domain.Models;

namespace OpenData.API.Resources
{
    public class ApplicationResource
    {
        public int Id { get; set; }
        public string Reason { get; set; }
        public CoordinationResource Coordination { get; set; }
        public DatasetResource Dataset { get; set; }
    }
}