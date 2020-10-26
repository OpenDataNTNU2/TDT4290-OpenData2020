using OpenData.API.Domain.Models;
using OpenData.External.Gitlab.Models;
using OpenData.External.Gitlab;
using System.Threading.Tasks;
using OpenData.API.Domain.Services;
using System.Net.Http;

namespace OpenData.API.Services
{
    public class GitlabService : IGitlabService
    {
        private readonly GitlabClient _gitlabClient;
        private readonly GitlabProjectConfiguration _gitlabProjectConfig;
        
        public GitlabService(IHttpClientFactory clientFactory)
        {
            _gitlabProjectConfig = new GitlabProjectConfiguration();
            // TODO: litt stygt å bare sende denne videre sånn men who cares
            _gitlabClient = new GitlabClient(_gitlabProjectConfig, clientFactory);
        }

        public void CreateDatasetProject(Dataset dataset)
        {
            GitlabProject gitlabProject = _gitlabProjectConfig.generateDefaultGitlabProject();
            _PopulateGitlabProjectWithDataset(gitlabProject, dataset);
            _gitlabClient.CreateGitlabProject(gitlabProject);
        }

        private void _PopulateGitlabProjectWithDataset(GitlabProject gitlabProject, Dataset dataset)
        {
            gitlabProject.name = dataset.Title;
            gitlabProject.description = dataset.Description;
            // gitlabProject.tag_list = null; // TODO: her må det gå an å gjøre noe
        }
    }
}