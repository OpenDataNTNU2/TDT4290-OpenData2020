using OpenData.External.Gitlab.Models;

namespace OpenData.External.Gitlab
{
    public class GitlabProjectConfiguration
    {
        public readonly int open_data_user_id;
        public readonly int open_data_namespace_id;
        
        public GitlabProjectConfiguration()
        {
            // TODO: hent dette fra config
            open_data_user_id = 5;
            open_data_namespace_id = 7;
        }

        public GitlabProject generateDefaultGitlabProject()
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
    }
}