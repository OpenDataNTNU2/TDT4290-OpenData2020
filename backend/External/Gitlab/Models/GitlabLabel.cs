namespace OpenData.External.Gitlab.Models
{
    public class GitlabLabel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string color { get; set; }
        public string description { get; set; }
        public string description_html { get; set; }
        public string text_color { get; set; }
        public bool? subscribed { get; set; }
        public string priority { get; set; } // usikker på typen
        public bool is_project_label { get; set; }
    }
}
