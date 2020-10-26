using System.Collections.Generic;

namespace OpenData.External.Gitlab.Models
{
    public class GitlabProject
    {
        // from https://docs.gitlab.com/ee/api/projects.html#create-project-for-user
        public int user_id {get; set; } //  	yes 	The user ID of the project owner
        public string name {get; set; } // 	yes 	The name of the new project
        public string path {get; set; } // 	no 	Custom repository name for new project. By default generated based on name
        public int? namespace_id {get; set;} // 	no 	Namespace for the new project (defaults to the current user’s namespace)
        public string description {get; set;} // 	no 	Short project description
        public bool? issues_enabled {get; set;} //  	no 	(deprecated) Enable issues for this project. Use issues_access_level instead
        public bool? merge_requests_enabled {get; set;} //  	no 	(deprecated) Enable merge requests for this project. Use merge_requests_access_level instead
        public bool? jobs_enabled {get; set;} //  	no 	(deprecated) Enable jobs for this project. Use builds_access_level instead
        public bool? wiki_enabled {get; set;} //  	no 	(deprecated) Enable wiki for this project. Use wiki_access_level instead
        public bool? snippets_enabled {get; set;} // 	no 	(deprecated) Enable snippets for this project. Use snippets_access_level instead
        public string issues_access_level {get; set;} // 	no 	One of disabled, private or enabled
        public string repository_access_level {get; set;} // 	no 	One of disabled, private or enabled
        public string merge_requests_access_level {get; set;} // 	no 	One of disabled, private or enabled
        public string forking_access_level {get; set;} //  	no 	One of disabled, private or enabled
        public string builds_access_level {get; set;} // 	no 	One of disabled, private or enabled
        public string wiki_access_level {get; set; } // 	no 	One of disabled, private or enabled
        public string snippets_access_level {get; set; } // 	no 	One of disabled, private or enabled
        public string pages_access_level {get; set; } // 	no 	One of disabled, private, enabled or public
        public string visibility {get; set; } // 	no 	See project visibility level
        public string import_url {get; set; } // 	no 	URL to import repository from
        public string merge_method {get; set; } // 	no 	Set the merge method used
        public string suggestion_commit_message {get; set; } // 	no 	The commit message used to apply merge request suggestions
        public string build_git_strategy {get; set; } // 	no 	The Git strategy. Defaults to fetch
        public string auto_cancel_pending_pipelines {get; set; } // 	no 	Auto-cancel pending pipelines (Note: this is not a boolean, but enabled/disabled
        public string build_coverage_regex {get; set; } // 	no 	Test coverage parsing
        public string ci_config_path {get; set; } // 	no 	The path to CI configuration file
        public string auto_devops_deploy_strategy {get; set; } // 	no 	Auto Deploy strategy (continuous, manual or timed_incremental)
        public string repository_storage {get; set; } // 	no 	Which storage shard the repository is on. Available only to admins
        public string external_authorization_classification_label {get; set; } // 	no 	The classification label for the project
        public string template_name {get; set; } // 	no 	When used without use_custom_template, name of a built-in project template. When used with use_custom_template, name of a custom project template
        public bool? emails_disabled {get; set; } // 	no 	Disable email notifications
        public bool? show_default_award_emojis {get; set; } // 	no 	Show default award emojis
        public bool? resolve_outdated_diff_discussions {get; set; } // 	no 	Automatically resolve merge request diffs discussions on lines changed with a push
        public bool? container_registry_enabled {get; set; } // 	no 	Enable container registry for this project
        public bool? shared_runners_enabled {get; set; } // 	no 	Enable shared runners for this project
        public bool? public_builds {get; set; } // 	no 	If true, jobs can be viewed by non-project-members
        public bool? only_allow_merge_if_pipeline_succeeds {get; set; } // 	no 	Set whether merge requests can only be merged with successful jobs
        public bool? allow_merge_on_skipped_pipeline {get; set; } // 	no 	Set whether or not merge requests can be merged with skipped jobs
        public bool? only_allow_merge_if_all_discussions_are_resolved {get; set; } // 	no 	Set whether merge requests can only be merged when all the discussions are resolved
        public bool? autoclose_referenced_issues {get; set; } // 	no 	Set whether auto-closing referenced issues on default branch
        public bool? remove_source_branch_after_merge {get; set; } // 	no 	Enable Delete source branch option by default for all new merge requests
        public bool? lfs_enabled {get; set; } // 	no 	Enable LFS
        public bool? request_access_enabled {get; set; } // 	no 	Allow users to request member access
        public bool? printing_merge_request_link_enabled {get; set; } // 	no 	Show link to create/view merge request when pushing from the command line
        public bool? auto_devops_enabled {get; set; } // 	no 	Enable Auto DevOps for this project
        public bool? mirror {get; set; } // 	no 	Enables pull mirroring in a project
        public bool? mirror_trigger_builds {get; set; } // 	no 	Pull mirroring triggers builds
        public bool? initialize_with_readme {get; set; } // 	no 	false by default
        public bool? use_custom_template {get; set; } // 	no 	Use either custom instance or group (with group_with_project_templates_id) project template
        public bool? packages_enabled {get; set; } // 	no 	Enable or disable packages repository feature
        public int? build_timeout {get; set; } // 	no 	The maximum amount of time in minutes that a job is able run (in seconds)
        public int? approvals_before_merge {get; set; } // 	no 	How many approvers should approve merge requests by default
        public int? group_with_project_templates_id {get; set; } // 	no 	For group-level custom templates, specifies ID of group from which all the custom project templates are sourced. Leave empty for instance-level templates. Requires use_custom_template to be true
        public IList<string> tag_list { get; set; } = new List<string>(); //     no 	The list of tags for a project; put array of tags, that should be finally assigned to a project 
    }
}