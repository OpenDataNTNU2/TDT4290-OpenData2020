using OpenData.External.Gitlab.Models;
using OpenData.External.Gitlab.Services.Communication;
using System.Net.Http;
using System.Net;
using System;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;

namespace OpenData.External.Gitlab
{
    public class GitlabClient : IGitlabClient
    {
        private readonly HttpClient _gitlabApiHttpClient;
        private readonly JsonSerializerOptions _jsonSerializerOptions;
        private readonly string _gitlabHost;
        public GitlabClient(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            HttpClient client = httpClientFactory.CreateClient();

            _gitlabHost = configuration["gitlabUrl"];
            string bearerToken = configuration["gitlabToken"];

            client.BaseAddress = new Uri(_gitlabHost + "api/v4/");
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
            return _PostGitlabObject(gitlabProject, endpoint);
        }

        public Task<GitlabResponse<GitlabProject>> UpdateGitlabProject(GitlabProject gitlabProject)
        {
            // api endpoint: PUT /projects/:id
            var endpoint = "projects/" + gitlabProject.id;
            return _PutGitlabObject(gitlabProject, endpoint);
        }

        public Task<GitlabResponse<GitlabGroup>> CreateGitlabGroup(GitlabGroup gitlabGroup)
        {
            // api endpoint: POST /groups
            var endpoint = "groups";
            return _PostGitlabObject(gitlabGroup, endpoint);
        }

        public async Task<GitlabResponse<GitlabIssueBoard>> SetUpIssueDiscussionBoardForGitlabProject(GitlabProject gitlabProject)
        {
            // lag en ny gitlab frontend client som er autentisert
            GitlabFrontendClient authorizedGitlabFrontendClient;
            try {
                authorizedGitlabFrontendClient = await GitlabFrontendClient.CreateAuthorizedGitlabFrontendClientForGitlabProject(_gitlabHost, gitlabProject);
            } catch (Exception e) {
                return GitlabResponse<GitlabIssueBoard>.Error($"Failed to authorize gitlab frontent client: ${e.Message}");
            }

            // slett alle tidligere issue boards
            var deletionResponse = await _DeleteAllIssueBoardsForGitlabProject(gitlabProject, authorizedGitlabFrontendClient);
            if (!deletionResponse.Success) return GitlabResponse<GitlabIssueBoard>.Error($"Failed to delete gitlab issue boards: {deletionResponse.Message}");

            // slett alle gamle labels for prosjektet
            deletionResponse = await _DeleteAllLabelsForGitlabProject(gitlabProject);
            if (!deletionResponse.Success) return GitlabResponse<GitlabIssueBoard>.Error($"Failed to delete gitlab project labels: {deletionResponse.Message}");

            // lag et nytt issue board for diskusjon med riktige lister og labels
            return await _CreateNewDiscussionIssueBoardWithCorrectIssueListsAndLabelsForProject(gitlabProject, authorizedGitlabFrontendClient);
        }

        private async Task<GitlabResponse<GitlabIssueBoard>> _CreateNewDiscussionIssueBoardWithCorrectIssueListsAndLabelsForProject(GitlabProject gitlabProject, GitlabFrontendClient authorizedGitlabFrontendClient)
        {
            // opprett nytt issue board med riktig navn
            var newIssueBoardResponse = await _CreateNewDiscussionIssueBoardWithCorrectNameForProject(gitlabProject, authorizedGitlabFrontendClient);
            if (!newIssueBoardResponse.Success) return GitlabResponse<GitlabIssueBoard>.Error(newIssueBoardResponse.Message);

            // slett alle issue listene på issue boardet
            var newIssueBoard = newIssueBoardResponse.Resource;
            var issueListsDeletionResponse = await _DeleteAllIssueListsInIssueBoardForGitlabProject(gitlabProject, newIssueBoard);
            if (!issueListsDeletionResponse.Success) return GitlabResponse<GitlabIssueBoard>.Error(issueListsDeletionResponse.Message);

            // opprett nye issue lister for labels i open-data namespacet
            var issueListCreationResponse = await _CreateNewIssueListsForAllOpenDataLabelsOnIssueBoardInGitlabProject(gitlabProject, newIssueBoard);
            if (!issueListCreationResponse.Success) return GitlabResponse<GitlabIssueBoard>.Error(issueListCreationResponse.Message);

            // alt vellykket, returner riktig issue board
            return GitlabResponse<GitlabIssueBoard>.Successful(newIssueBoard);
        }

        private async Task<GitlabResponse> _CreateNewIssueListsForAllOpenDataLabelsOnIssueBoardInGitlabProject(GitlabProject gitlabProject, GitlabIssueBoard issueBoard)
        {
            // hent først ned en liste over alle labels i open-data gruppen
            var openDataGroupId = 7; // TODO: hent denne på en smart måte
            var getGroupLabelsEndpoint = $"groups/{openDataGroupId}/labels";
            var groupLabelsResponse = await _GetGitlabObject<List<GitlabLabel>>(getGroupLabelsEndpoint);
            if (!groupLabelsResponse.Success) return GitlabResponse.Error($"Failed to get gitlab labels for open data group: {groupLabelsResponse.Message}");

            // fjerner disse for sikkerhets skyld og sorterer på id slik at det blir konsistent
            var groupLabels = groupLabelsResponse.Resource
                    .Where(l => !l.name.Equals("To Do"))
                    .Where(l => !l.name.Equals("Doing"))
                    .OrderBy(l => l.id);

            // legg til labels på issue listen
            var creationResults = await Task.Run(() => groupLabels // kjører synkront for at rekkefølgen skal bli riktig
                    .Select(label => new GitlabIssueList() { label_id = label.id })
                    .Select(list => _PostGitlabObject(list, $"projects/{gitlabProject.id}/boards/{issueBoard.id}/lists"))
                    .Select(task => { task.Wait(); return task.Result; })); 
            if (creationResults.All(r => r.Success)) return GitlabResponse.Successful();
            else return GitlabResponse.Error($"Failed to create gitlab issue lists: {_AggregateErrorMessages(creationResults.Where(r => !r.Success).Select(r => GitlabResponse.Error(r.Message)).ToArray())}");
        }

        private async Task<GitlabResponse> _DeleteAllIssueListsInIssueBoardForGitlabProject(GitlabProject gitlabProject, GitlabIssueBoard issueBoard)
        {
            // hent ned en liste over lister for issue boardet
            var endpoint = $"projects/{gitlabProject.id}/boards/{issueBoard.id}/lists";
            var issueListsResponse = await _GetGitlabObject<List<GitlabIssueList>>(endpoint);
            if (!issueListsResponse.Success) return GitlabResponse.Error($"Failed to get issue board lists: {issueListsResponse.Message}");
            var issueLists = issueListsResponse.Resource;

            // slett listene på issue boardet
            var deletionResults = await Task.WhenAll(issueLists
                    .Select(async list => await _DeleteGitlabObject($"projects/{gitlabProject.id}/boards/{issueBoard.id}/lists/{list.id}")));
            if (deletionResults.All(r => r.Success)) return GitlabResponse.Successful();
            else return GitlabResponse.Error($"Failed to delete gitlab issue lists: {_AggregateErrorMessages(deletionResults)}");
        }

        private Task<GitlabResponse<GitlabIssueBoard>> _CreateNewDiscussionIssueBoardWithCorrectNameForProject(GitlabProject gitlabProject, GitlabFrontendClient authorizedGitlabFrontendClient)
        {
            // Opprett først et nytt issue board med riktig navn
            // TODO: config kanskje?
            var newIssueBoardName = "Diskusjon";
            return authorizedGitlabFrontendClient.CreateGitlabIssueBoardWithNameForProject(gitlabProject, newIssueBoardName);
        }

        private async Task<GitlabResponse> _DeleteAllIssueBoardsForGitlabProject(GitlabProject gitlabProject, GitlabFrontendClient authorizedGitlabFrontendClient)
        {
            // hent først ned en liste over alle eksisterende gitlab issue boards.
            var issueBoardsEndpoint = $"projects/{gitlabProject.id}/boards";
            var gitlabIssueBoards = await _GetGitlabObject<List<GitlabIssueBoard>>(issueBoardsEndpoint);
            if (!gitlabIssueBoards.Success) return GitlabResponse.Error($"Failed to get gitlab issue boards: {gitlabIssueBoards.Message}");

            // disse skal slettes
            var deletionResults = await Task.WhenAll(gitlabIssueBoards.Resource
                    .Select(async board => await authorizedGitlabFrontendClient.DeleteGitlabIssueBoardForProject(gitlabProject, board)));
            if (deletionResults.All(r => r.Success)) return GitlabResponse.Successful();
            else return GitlabResponse.Error($"Failed to delete gitlab issue boards: {_AggregateErrorMessages(deletionResults)}");
        }

        private async Task<GitlabResponse> _DeleteAllLabelsForGitlabProject(GitlabProject gitlabProject)
        {
            var endpoint = $"projects/{gitlabProject.id}/labels";
            var labels = await _GetGitlabObject<List<GitlabLabel>>(endpoint);
            if (labels.Success) {
                var deletionResults = await Task.WhenAll(labels.Resource.Where(l => l.is_project_label)
                        .Select(async l => await _DeleteGitlabObject(endpoint + $"/{l.id}")));
                if (deletionResults.All(response => response.Success)) return GitlabResponse.Successful();
                else return GitlabResponse.Error($"Failed to delete project labels for gitlab project {gitlabProject.id}, reason: {_AggregateErrorMessages(deletionResults)}");
            } else {
                return GitlabResponse.Error($"Failed to get all labels for gitlab project {gitlabProject.id}");
            }
        }

        private static string _AggregateErrorMessages(GitlabResponse[] results)
        {
            return results.Where(r => !r.Success)
                    .Select(r => r.Message)
                    .Aggregate(string.Empty, (errors, message) => string.Format("{0},\n{1}", errors, message));
        }

        private Task<GitlabResponse<T>> _GetGitlabObject<T>(string endpoint)
        {
            var httpRequest = new HttpRequestMessage(HttpMethod.Get, endpoint);
            return _SendRequestAndRecieveGitlabObject<T>(httpRequest);
        }

        private async Task<GitlabResponse> _DeleteGitlabObject(string endpoint)
        {
            try {
                var httpResponse = await _gitlabApiHttpClient.GetAsync(endpoint);
                var content = await httpResponse.Content.ReadAsStringAsync();
                if (httpResponse.IsSuccessStatusCode) return GitlabResponse.Successful();
                else return GitlabResponse.Error(content);
            } catch (HttpRequestException e) {
                return GitlabResponse.Error(e.Message);
            }
        }

        private Task<GitlabResponse<T>> _PostGitlabObject<T>(T gitlabObject, string endpoint)
        {
            var gitlabObjectJson = new StringContent(
                    JsonSerializer.Serialize(gitlabObject, _jsonSerializerOptions),
                    Encoding.UTF8,
                    "application/json");

            var httpRequest = new HttpRequestMessage(HttpMethod.Post, endpoint) {
                Content = gitlabObjectJson
            };

            return _SendRequestAndRecieveGitlabObject<T>(httpRequest);
        }

        private Task<GitlabResponse<T>> _PutGitlabObject<T>(T gitlabObject, string endpoint)
        {
            var gitlabObjectJson = new StringContent(
                    JsonSerializer.Serialize(gitlabObject, _jsonSerializerOptions),
                    Encoding.UTF8,
                    "application/json");

            var httpRequest = new HttpRequestMessage(HttpMethod.Put, endpoint) {
                Content = gitlabObjectJson
            };

            return _SendRequestAndRecieveGitlabObject<T>(httpRequest);
        }

        private async Task<GitlabResponse<T>> _SendRequestAndRecieveGitlabObject<T>(HttpRequestMessage httpRequest)
        {
            try {
                var httpResponse = await _gitlabApiHttpClient.SendAsync(httpRequest);
                var content = await httpResponse.Content.ReadAsStringAsync();
                // Console.WriteLine("\n" + content + "\n");
                if (httpResponse.IsSuccessStatusCode) return GitlabResponse<T>.Successful(JsonSerializer.Deserialize<T>(content));
                else return GitlabResponse<T>.Error(content);
            } catch (HttpRequestException e) {
                return GitlabResponse<T>.Error(e.Message);
            }
        }
    }
}
