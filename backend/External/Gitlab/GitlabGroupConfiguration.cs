using OpenData.External.Gitlab.Models;
using Microsoft.Extensions.Configuration;

namespace OpenData.External.Gitlab
{
    public class GitlabGroupConfiguration
    {
        public readonly int open_data_user_id;
        public readonly int open_data_namespace_id;

        public GitlabGroupConfiguration(IConfiguration gitlabProjectConfiguration)
        {
            open_data_user_id = gitlabProjectConfiguration.GetValue<int>("OpenDataUserId");
            open_data_namespace_id = gitlabProjectConfiguration.GetValue<int>("OpenDataNamespaceId");
        }

        public GitlabGroup generateDefaultGitlabGroup()
        {
            GitlabGroup gitlabGroup = new GitlabGroup();
            gitlabGroup.parent_id = open_data_namespace_id;
            gitlabGroup.visibility = "public";
            gitlabGroup.project_creation_level = "maintainer";
            gitlabGroup.subgroup_creation_level = "owner";
            gitlabGroup.membership_lock = true;
            gitlabGroup.auto_devops_enabled = false;

            return gitlabGroup;
        }
    }
}
