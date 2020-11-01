using OpenData.External.Gitlab.Models;
using OpenData.External.Gitlab.Services.Communication;
using OpenData.API.Domain.Services.Communication;
using System.Net.Http;
using System;
using System.Threading.Tasks;
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

        public Task<GitlabResponse<GitlabProject>> CreateGitlabProject(GitlabProject gitlabProject)
        {
            // api endpoint: POST /projects/user/:user_id
            var endpoint = "projects/user/" + _gitlabProjectConfig.open_data_user_id;
            return _PostGitlabObject(gitlabProject, endpoint);
        }

        public Task<GitlabResponse<GitlabGroup>> CreateGitlabGroup(GitlabGroup gitlabGroup)
        {
            // api endpoint: POST /groups
            var endpoint = "groups";
            return _PostGitlabObject(gitlabGroup, endpoint);
        }

        private async Task<GitlabResponse<T>> _PostGitlabObject<T>(T gitlabObject, string endpoint)
        {
            var gitlabGroupJson = new StringContent(
                    JsonSerializer.Serialize(gitlabObject, _jsonSerializerOptions),
                    Encoding.UTF8,
                    "application/json");

            try {
                var httpResponse = await _gitlabApiHttpClient.PostAsync(endpoint, gitlabGroupJson);
                var content = await httpResponse.Content.ReadAsStringAsync();
                if (httpResponse.IsSuccessStatusCode) {
                    return new GitlabResponse<T>(JsonSerializer.Deserialize<T>(content));
                } else {
                    return new GitlabResponse<T>(content);
                }
            } catch (HttpRequestException e) {
                return new GitlabResponse<T>(e.Message);
            }
        }
    }
}

