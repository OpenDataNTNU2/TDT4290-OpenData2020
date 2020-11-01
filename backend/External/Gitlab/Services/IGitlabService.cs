using System.Threading.Tasks;
using OpenData.API.Domain.Models;
using OpenData.External.Gitlab.Services.Communication;
using OpenData.External.Gitlab.Models;

namespace OpenData.External.Gitlab.Services
{
    public interface IGitlabService
    {
         Task<GitlabResponse<GitlabProject>> CreateDatasetProject(Dataset dataset);
         Task<GitlabResponse<GitlabGroup>> CreateGitlabGroupForPublisher(Publisher publisher);
    }
}