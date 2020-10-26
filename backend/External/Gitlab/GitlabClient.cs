using OpenData.External.Gitlab.Models;
using System.Net.Http;
using System;
using System.Text.Json;
using System.Text;

namespace OpenData.External.Gitlab
{
    public class GitlabClient
    {
        private readonly HttpClient _gitlabApiHttpClient;
        private readonly GitlabProjectConfiguration _gitlabProjectConfig;

        private readonly JsonSerializerOptions _jsonSerializerOptions;
        public GitlabClient(GitlabProjectConfiguration gitlabProjectConfiguration, IHttpClientFactory httpClientFactory)
        {
            _gitlabProjectConfig = gitlabProjectConfiguration;
            HttpClient client = httpClientFactory.CreateClient();

            // TODO: hent inn på en smart måte fra config elns
            client.BaseAddress = new Uri("http://gitlab.potrik.com/api/v4/");
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer hqU-vAW9x3" + "nLGqLi5zbZ"); // delt i to for å unngå skumle bots som søker etter api-keys #much-securiti

            _gitlabApiHttpClient = client;

            _jsonSerializerOptions = new JsonSerializerOptions();
            _jsonSerializerOptions.IgnoreNullValues = true;
        }

        public async void CreateGitlabProject(GitlabProject gitlabProject)
        {
            // endpoint: POST /projects/user/:user_id,
            var endpoint = "projects/user/" + _gitlabProjectConfig.open_data_user_id;

            var gitlabProjectJson = new StringContent(
                    JsonSerializer.Serialize(gitlabProject, _jsonSerializerOptions),
                    Encoding.UTF8,
                    "application/json");

            Console.WriteLine(gitlabProjectJson);

            using var httpResponse =
                await _gitlabApiHttpClient.PostAsync(endpoint, gitlabProjectJson);
            
           var content = await httpResponse.Content.ReadAsStringAsync();
           
           Console.WriteLine(content);

            httpResponse.EnsureSuccessStatusCode();
        }
    }
}

