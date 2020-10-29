using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.External.Gitlab.Services.Communication;

namespace OpenData.External.Gitlab.Services
{
    public interface IGitlabService
    {
         Task<GitlabProjectResponse> CreateDatasetProject(Dataset dataset);
    }
}