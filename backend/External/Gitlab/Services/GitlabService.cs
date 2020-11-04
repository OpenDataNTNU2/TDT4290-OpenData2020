using OpenData.API.Domain.Models;
using OpenData.External.Gitlab.Models;
using System.Threading.Tasks;
using OpenData.External.Gitlab.Services.Communication;
using System.Net.Http;
using System.Linq;
using System.Collections.Generic;

namespace OpenData.External.Gitlab.Services
{
    public class GitlabService : IGitlabService
    {
        private readonly IGitlabClient _gitlabClient;
        private readonly GitlabProjectConfiguration _gitlabProjectConfig;
        private readonly GitlabGroupConfiguration _gitlabGroupConfig;

        public GitlabService(IGitlabClient gitlabClient)
        {
            _gitlabProjectConfig = new GitlabProjectConfiguration();
            _gitlabGroupConfig = new GitlabGroupConfiguration();

            _gitlabClient = gitlabClient;
        }

        public async Task<GitlabResponse<GitlabProject>> CreateDatasetProject(Dataset dataset)
        {
            GitlabProject gitlabProject = _gitlabProjectConfig.GenerateDefaultGitlabProject();
            _PopulateGitlabProjectWithDataset(gitlabProject, dataset);
            return await await _gitlabClient.CreateGitlabProject(gitlabProject)
                    .ContinueWith(_SetUpIssueDiscussionBoardForGitlabProject, TaskContinuationOptions.OnlyOnRanToCompletion);
        }

        public Task<GitlabResponse<GitlabGroup>> CreateGitlabGroupForPublisher(Publisher publisher)
        {
            GitlabGroup gitlabGroup = _gitlabGroupConfig.generateDefaultGitlabGroup();
            _PopulateGitlabGroupWithPublisherInformation(gitlabGroup, publisher);
            return _gitlabClient.CreateGitlabGroup(gitlabGroup);
        }

        public async Task<GitlabResponse<GitlabProject>> CreateGitlabProjectForCoordination(Coordination coordination)
        {
            GitlabProject gitlabProject = _gitlabProjectConfig.GenerateDefaultCoordinationGitlabProject();
            gitlabProject.name = coordination.Title;
            gitlabProject.description = coordination.Description;
            return await await _gitlabClient.CreateGitlabProject(gitlabProject)
                    .ContinueWith(_SetUpIssueDiscussionBoardForGitlabProject, TaskContinuationOptions.OnlyOnRanToCompletion);
        }

        private async Task<GitlabResponse<GitlabProject>> _SetUpIssueDiscussionBoardForGitlabProject(Task<GitlabResponse<GitlabProject>> createGitlabProjectTask)
        {
            if (createGitlabProjectTask.Result.Success) {
                var createdGitlabProject = createGitlabProjectTask.Result.Resource;
                var issueBoardCreationResponse = await _gitlabClient.SetUpIssueDiscussionBoardForGitlabProject(createdGitlabProject);
                if (issueBoardCreationResponse.Success) {
                    createdGitlabProject.defaultGitlabIssueBoardId = issueBoardCreationResponse.Resource.id;
                    return GitlabResponse<GitlabProject>.Successful(createdGitlabProject);
                } else {
                    // TODO: fjerne gitlab-prosjektet når opprettelse feiler
                    return GitlabResponse<GitlabProject>.Error("Failed to set up gitlab issue board: " + issueBoardCreationResponse.Message);
                }
            } else return createGitlabProjectTask.Result;
        }

        private void _PopulateGitlabProjectWithDataset(GitlabProject gitlabProject, Dataset dataset)
        {
            gitlabProject.name = dataset.Title;
            gitlabProject.description = dataset.Description;
            gitlabProject.namespace_id = dataset.Publisher.GitlabGroupNamespaceId;
            gitlabProject.tag_list = dataset.DatasetTags.Select(tag => tag.Tags.Name).ToList();
        }

        private void _PopulateGitlabGroupWithPublisherInformation(GitlabGroup gitlabGroup, Publisher publisher)
        {
            gitlabGroup.name = publisher.Name;
            gitlabGroup.path = publisher.Name.Replace(' ', '-');
        }
    }
}
