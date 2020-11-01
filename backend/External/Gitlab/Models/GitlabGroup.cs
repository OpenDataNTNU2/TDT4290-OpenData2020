namespace OpenData.External.Gitlab.Models
{
    public class GitlabGroup
    {
        // from https://docs.gitlab.com/ce/api/groups.html#new-group
        public int? id { get; set; }
        public string web_url { get; set; }
        public string full_path { get; set; }
        public string name { get; set; } // 	yes 	The name of the group.
        public string path { get; set; } // 	yes 	The path of the group.
        public string description { get; set; } // 	no 	The group’s description.
        public string visibility { get; set; } // 	no 	The group’s visibility. Can be private, internal, or public.
        public string project_creation_level { get; set; } // 	no 	Determine if developers can create projects in the group. Can be noone (No one), maintainer (Maintainers), or developer (Developers + Maintainers).
        public string subgroup_creation_level { get; set; } // 	no 	Allowed to create subgroups. Can be owner (Owners), or maintainer (Maintainers).
        public string shared_runners_setting { get; set; } // 	no 	See Options for shared_runners_setting. Enable or disable shared runners for a group’s subgroups and projects.
        public bool? membership_lock { get; set; } // 	no 	Prevent adding new members to project membership within this group.
        public bool? share_with_group_lock { get; set; } // 	no 	Prevent sharing a project with another group within this group.
        public bool? require_two_factor_authentication { get; set; } // 	no 	Require all users in this group to setup Two-factor authentication.
        public bool? auto_devops_enabled { get; set; } // 	no 	Default to Auto DevOps pipeline for all projects within this group.
        public bool? emails_disabled { get; set; } // 	no 	Disable email notifications
        public bool? mentions_disabled { get; set; } // 	no 	Disable the capability of a group from getting mentioned
        public bool? lfs_enabled { get; set; } // 	no 	Enable/disable Large File Storage (LFS) for the projects in this group.
        public bool? request_access_enabled { get; set; } // 	no 	Allow users to request member access.
        public int? two_factor_grace_period { get; set; } // 	no 	Time before Two-factor authentication is enforced (in hours).
        public int? parent_id { get; set; } // 	no 	The parent group ID for creating nested group.
        public int? default_branch_protection { get; set; } // 	no 	See Options for default_branch_protection. Default to the global level default branch protection setting.
        public int? shared_runners_minutes_limit { get; set; } // 	no 	Pipeline minutes quota for this group (included in plan). Can be nil (default; inherit system default), 0 (unlimited) or > 0
        public int? extra_shared_runners_minutes_limit { get; set; } // 	no 	Extra pipeline minutes quota for this group (purchased in addition to the minutes included in the plan).
    }
}