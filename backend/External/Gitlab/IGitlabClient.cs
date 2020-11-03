using OpenData.External.Gitlab.Models;
using OpenData.External.Gitlab.Services.Communication;
using System.Threading.Tasks;

namespace OpenData.External.Gitlab
{
    public interface IGitlabClient
    {
        public Task<GitlabResponse<GitlabProject>> CreateGitlabProject(GitlabProject gitlabProject);
        public Task<GitlabResponse<GitlabGroup>> CreateGitlabGroup(GitlabGroup gitlabGroup);
    }
}