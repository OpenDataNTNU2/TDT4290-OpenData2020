namespace OpenData.External.Gitlab.Models
{
    public class GitlabIssuesStatistics
    {
        public GitlabIssuesStatisticsStatistics statistics;   
        public class GitlabIssuesStatisticsStatistics
        {
            public GitlabIssuesStatisticsCounts counts { get; set; }
            public class GitlabIssuesStatisticsCounts
            {
                public int all { get; set; }
                public int closed { get; set; }
                public int open { get; set; }
            }
        }
    }
}