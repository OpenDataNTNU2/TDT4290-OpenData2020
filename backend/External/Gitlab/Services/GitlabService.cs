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
            _PopulateGitlabProjectWithCatalogueItem(gitlabProject, dataset);
            gitlabProject.namespace_id = dataset.Publisher.GitlabGroupNamespaceId;
            return _gitlabClient.CreateGitlabProject(gitlabProject);
        }

        public Task<GitlabResponse<GitlabProject>> UpdateProject(ICatalogueItem catalogueItem)
        {
            GitlabProject gitlabProject = _gitlabProjectConfig.GenerateDefaultGitlabProject();
            _PopulateGitlabProjectWithCatalogueItem(gitlabProject, catalogueItem);
            gitlabProject.id = catalogueItem.GitlabProjectId;
            // TODO: Usikker på om pathen burde endres eller ikke. Kjipt med urler som endres og rart med urler som ikke gjenspeiler innholdet o.O
            // gitlabProject.path = dataset.Title.ToLower().Trim().Replace(' ', '-').Replace("æ", "ae").Replace("ø", "o").Replace("å", "aa"); 
            return _gitlabClient.UpdateGitlabProject(gitlabProject);
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
            _PopulateGitlabProjectWithCatalogueItem(gitlabProject, coordination);
            return _gitlabClient.CreateGitlabProject(gitlabProject);
        }

        private void _PopulateGitlabProjectWithCatalogueItem(GitlabProject gitlabProject, ICatalogueItem catalogueItem)
        {
            gitlabProject.name = catalogueItem.Title;
            gitlabProject.description = catalogueItem.Description.Substring(0, Math.Min(2000, catalogueItem.Description.Length)); // This is the max number of characters in the gitlab project
            if (catalogueItem is Dataset){
                var dataset = (Dataset)catalogueItem;
                gitlabProject.tag_list = dataset.DatasetTags.Select(tag => tag.Tags.Name).ToList();
            }
            if (catalogueItem is Coordination){
                var coordination = (Coordination)catalogueItem;
                gitlabProject.tag_list = coordination.CoordinationTags.Select(tag => tag.Tags.Name).ToList();
            }
        }

        private void _PopulateGitlabGroupWithPublisherInformation(GitlabGroup gitlabGroup, Publisher publisher)
        {
            gitlabGroup.name = publisher.Name;
            gitlabGroup.path = publisher.Name.ToLower().Trim().Replace(' ', '-').Replace("æ", "ae").Replace("ø", "o").Replace("å", "aa");
        }
    }
}
