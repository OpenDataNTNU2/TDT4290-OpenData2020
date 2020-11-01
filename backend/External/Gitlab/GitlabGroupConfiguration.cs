using OpenData.External.Gitlab.Models;

namespace OpenData.External.Gitlab
{
    public class GitlabGroupConfiguration
    {
        public readonly int open_data_user_id;
        public readonly int open_data_namespace_id;

        public GitlabGroupConfiguration()
        {
            // TODO: hent dette fra config
            open_data_user_id = 5;
            open_data_namespace_id = 7;
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