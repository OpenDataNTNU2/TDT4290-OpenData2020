namespace OpenData.External.Gitlab.Models
{
    public class GitlabIssueList
    {
        public int? id { get; set; }
        public int? position { get; set; }
        public int? label_id { get; set; }
        public GitlabLabel label { get; set; }
    }
}
