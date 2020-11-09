using OpenData.External.Gitlab.Models;
using OpenData.External.Gitlab.Services.Communication;
using OpenData.API.Domain.Services.Communication;
using System.Net.Http;
using System;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace OpenData.External.Gitlab
{
    public class GitlabClient : IGitlabClient
    {
        private readonly HttpClient _gitlabApiHttpClient;
        private readonly JsonSerializerOptions _jsonSerializerOptions;
        public GitlabClient(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            HttpClient client = httpClientFactory.CreateClient();

            string gitlabUrl = configuration["gitlabUrl"];
            string bearerToken = configuration["gitlabToken"];

            client.BaseAddress = new Uri(gitlabUrl + "api/v4/");
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + bearerToken);

            _gitlabApiHttpClient = client;

            _jsonSerializerOptions = new JsonSerializerOptions();
            _jsonSerializerOptions.IgnoreNullValues = true;
        }

        public Task<GitlabResponse<GitlabProject>> CreateGitlabProject(GitlabProject gitlabProject)
        {
            // api endpoint: POST /projects/user/:user_id
            var endpoint = "projects/user/" + gitlabProject.user_id;
            return _SendGitlabObject(gitlabProject, endpoint, "POST");
        }

        public Task<GitlabResponse<GitlabProject>> UpdateGitlabProject(GitlabProject gitlabProject)
        {
            // api endpoint: PUT /projects/:id
            var endpoint = "projects/" + gitlabProject.id;
            return _SendGitlabObject(gitlabProject, endpoint, "PUT");
        }

        public Task<GitlabResponse<GitlabGroup>> CreateGitlabGroup(GitlabGroup gitlabGroup)
        {
            // api endpoint: POST /groups
            var endpoint = "groups";
            return _SendGitlabObject(gitlabGroup, endpoint, "POST");
        }

        private async Task<GitlabResponse<T>> _SendGitlabObject<T>(T gitlabObject, string endpoint, string method)
        {
            var gitlabObjectJson = new StringContent(
                    JsonSerializer.Serialize(gitlabObject, _jsonSerializerOptions),
                    Encoding.UTF8,
                    "application/json");

            try {
                // Console.WriteLine("\n" + (await gitlabObjectJson.ReadAsStringAsync()) + "\n");
                HttpResponseMessage httpResponse;
                switch (method)
                {
                    case "PUT":
                        httpResponse = await _gitlabApiHttpClient.PutAsync(endpoint, gitlabObjectJson);
                        break;
                    case "POST":
                    default:
                        httpResponse = await _gitlabApiHttpClient.PostAsync(endpoint, gitlabObjectJson);
                        break;
                }
                
                var content = await httpResponse.Content.ReadAsStringAsync();
                // Console.WriteLine("\n" + content + "\n");
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
