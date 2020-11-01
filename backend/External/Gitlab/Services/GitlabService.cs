using OpenData.API.Domain.Models;
using OpenData.External.Gitlab.Models;
using System.Threading.Tasks;
using OpenData.External.Gitlab.Services.Communication;
using System.Net.Http;

namespace OpenData.External.Gitlab.Services
{
    public class GitlabService : IGitlabService
    {
        private readonly GitlabClient _gitlabClient;
        private readonly GitlabProjectConfiguration _gitlabProjectConfig;
        private readonly GitlabGroupConfiguration _gitlabGroupConfig;

        public GitlabService(IHttpClientFactory clientFactory)
        {
            _gitlabProjectConfig = new GitlabProjectConfiguration();
            _gitlabGroupConfig = new GitlabGroupConfiguration();

            // TODO: litt stygt å bare sende denne videre sånn men who cares
            _gitlabClient = new GitlabClient(_gitlabProjectConfig, clientFactory);
        }

        public Task<GitlabResponse<GitlabProject>> CreateDatasetProject(Dataset dataset)
        {
            GitlabProject gitlabProject = _gitlabProjectConfig.generateDefaultGitlabProject();
            _PopulateGitlabProjectWithDataset(gitlabProject, dataset);
            return _gitlabClient.CreateGitlabProject(gitlabProject);
        }

        public Task<GitlabResponse<GitlabGroup>> CreateGitlabGroupForPublisher(Publisher publisher)
        {
            GitlabGroup gitlabGroup = _gitlabGroupConfig.generateDefaultGitlabGroup();
            _PopulateGitlabGroupWithPublisherInformation(gitlabGroup, publisher);
            return _gitlabClient.CreateGitlabGroup(gitlabGroup);
        }

        private void _PopulateGitlabProjectWithDataset(GitlabProject gitlabProject, Dataset dataset)
        {
            gitlabProject.name = dataset.Title;
            gitlabProject.description = dataset.Description;
            // gitlabProject.tag_list = null; // TODO: her må det gå an å gjøre noe
        }

        private void _PopulateGitlabGroupWithPublisherInformation(GitlabGroup gitlabGroup, Publisher publisher)
        {
            gitlabGroup.name = publisher.Name;
            gitlabGroup.path = publisher.Name.Replace(' ', '-');
        }
    }
}