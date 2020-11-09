using OpenData.External.Gitlab.Models;
using Microsoft.Extensions.Configuration;

namespace OpenData.External.Gitlab
{
    public class GitlabProjectConfiguration
    {
        public readonly int open_data_user_id;
        public readonly int open_data_namespace_id;
        public readonly int open_data_coordinations_namespace_id;
        
        public GitlabProjectConfiguration(IConfiguration _gitlabProjectsConfiguration)
        {
            open_data_user_id = _gitlabProjectsConfiguration.GetValue<int>("OpenDataUserId");
            open_data_namespace_id = _gitlabProjectsConfiguration.GetValue<int>("OpenDataNamespaceId");
            open_data_coordinations_namespace_id = _gitlabProjectsConfiguration.GetValue<int>("OpenDataCoordinationsNamespaceId");
        }

        public GitlabProject GenerateDefaultGitlabProject()
        {
            GitlabProject gitlabProject = new GitlabProject();
            gitlabProject.user_id = open_data_user_id;
            gitlabProject.namespace_id = open_data_namespace_id;

            gitlabProject.merge_requests_access_level = "enabled";
            gitlabProject.forking_access_level = "enabled";
            gitlabProject.issues_access_level = "enabled";
            gitlabProject.repository_access_level = "enabled";
            gitlabProject.builds_access_level = "private";
            gitlabProject.wiki_access_level = "enabled";
            gitlabProject.snippets_access_level = "enabled";
            gitlabProject.pages_access_level = "enabled";
            gitlabProject.visibility = "public";

            return gitlabProject;
        }

        public GitlabProject GenerateDefaultCoordinationGitlabProject()
        {
            GitlabProject gitlabProject = GenerateDefaultGitlabProject();
            gitlabProject.namespace_id = open_data_coordinations_namespace_id;
            return gitlabProject;
        }
    }
}
