using OpenData.API.Domain.Models;
using OpenData.External.Gitlab.Models;
using System.Threading.Tasks;
using OpenData.External.Gitlab.Services.Communication;
using System.Net.Http;
using System.Linq;
using System.Collections.Generic;
using System;

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

        public Task<GitlabResponse<GitlabProject>> CreateDatasetProject(Dataset dataset)
        {
            GitlabProject gitlabProject = _gitlabProjectConfig.GenerateDefaultGitlabProject();
            _PopulateGitlabProjectWithDataset(gitlabProject, dataset);
            return _gitlabClient.CreateGitlabProject(gitlabProject);
        }

        public Task<GitlabResponse<GitlabGroup>> CreateGitlabGroupForPublisher(Publisher publisher)
        {
            GitlabGroup gitlabGroup = _gitlabGroupConfig.generateDefaultGitlabGroup();
            _PopulateGitlabGroupWithPublisherInformation(gitlabGroup, publisher);
            return _gitlabClient.CreateGitlabGroup(gitlabGroup);
        }

        public Task<GitlabResponse<GitlabProject>> CreateGitlabProjectForCoordination(Coordination coordination)
        {
            GitlabProject gitlabProject = _gitlabProjectConfig.GenerateDefaultCoordinationGitlabProject();
            gitlabProject.name = coordination.Title;
            gitlabProject.description = coordination.Description;
            return _gitlabClient.CreateGitlabProject(gitlabProject);
        }

        private void _PopulateGitlabProjectWithDataset(GitlabProject gitlabProject, Dataset dataset)
        {
            gitlabProject.name = dataset.Title;
            gitlabProject.description = dataset.Description.Substring(0, Math.Min(2000, dataset.Description.Length)); // This is the max number of characters in the gitlab project
            gitlabProject.namespace_id = dataset.Publisher.GitlabGroupNamespaceId;
            gitlabProject.tag_list = dataset.DatasetTags.Select(tag => tag.Tags.Name).ToList();
        }

        private void _PopulateGitlabGroupWithPublisherInformation(GitlabGroup gitlabGroup, Publisher publisher)
        {
            gitlabGroup.name = publisher.Name;
            gitlabGroup.path = publisher.Name.ToLower().Trim().Replace(' ', '-').Replace("æ", "ae").Replace("ø", "o").Replace("å", "aa");
        }
    }
}
