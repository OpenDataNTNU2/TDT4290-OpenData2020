using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;

namespace OpenData.API.Domain.Services
{
    public interface IGitlabService
    {
         void CreateDatasetProject(Dataset dataset);
    }
}