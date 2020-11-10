using OpenData.External.Gitlab.Models;
using OpenData.External.Gitlab.Services.Communication;
using OpenData.API.Domain.Services.Communication;
using System.Net.Http;
using System.Net;
using System;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace OpenData.External.Gitlab
{
    public class GitlabFrontendClient
    {
        private readonly HttpClient _authorizedGitlabFrontendHttpClient;
        private GitlabFrontendClient(HttpClient authorizedGitlabFrontendHttpClient)
        {
            _authorizedGitlabFrontendHttpClient = authorizedGitlabFrontendHttpClient;
        }

        public async Task<GitlabResponse> DeleteGitlabIssueBoardForProject(GitlabProject gitlabProject, GitlabIssueBoard issueBoard)
        {
            var deleteEndpoint = $"/{gitlabProject.path_with_namespace}/-/boards/{issueBoard.id}.json";
            var response = await _authorizedGitlabFrontendHttpClient.DeleteAsync(deleteEndpoint);
            if (response.IsSuccessStatusCode) return GitlabResponse.Successful();
            return GitlabResponse.Error($"Failed to delete gitlab issue board with id {issueBoard.id}, reason: {await response.Content.ReadAsStringAsync()}");
        }

        public async Task<GitlabResponse<GitlabIssueBoard>> CreateGitlabIssueBoardWithNameForProject(GitlabProject gitlabProject, string issueBoardName)
        {
            var createEndpoint = $"/{gitlabProject.path_with_namespace}/-/boards.json";
            var issueBoardString = "{\"board\":{\"id\":false,\"name\":\"" + issueBoardName + "\",\"labels\":[],\"assignee\":{},\"weight\":null,\"hide_backlog_list\":true,\"hide_closed_list\":true,\"hideClosedList\":true,\"hideBacklogList\":true,\"label_ids\":[\"\"]}}";
            var issueBoardContent = new StringContent(issueBoardString, Encoding.UTF8, "application/json");
            var response = await _authorizedGitlabFrontendHttpClient.PostAsync(createEndpoint, issueBoardContent);
            var responseContentString = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode) return new GitlabResponse<GitlabIssueBoard>(JsonSerializer.Deserialize<GitlabIssueBoard>(responseContentString));
            else return new GitlabResponse<GitlabIssueBoard>($"Failed to create gitlab issue board: {responseContentString}");
        }

        public static async Task<GitlabFrontendClient> CreateAuthorizedGitlabFrontendClientForGitlabProject(IConfiguration gitlabConfiguration, GitlabProject gitlabProject)
        {
            var authorizedGitlabFrontendHttpClient = await _CreateAuthorizedGitlabFrontendHttpClient(gitlabConfiguration, gitlabProject);
            return new GitlabFrontendClient(authorizedGitlabFrontendHttpClient);
        }

        private static async Task<HttpClient> _CreateAuthorizedGitlabFrontendHttpClient(IConfiguration gitlabConfiguration, GitlabProject gitlabProject)
        {
            // lager først en ny HttpClient som kan benytte seg av cookies.
            // dette er for å kunne huske session cookie for å autentisere requests.
            string gitlabHost = gitlabConfiguration["GitlabHost"];
            var cookieContainer = new CookieContainer();
            var httpClientHandler = new HttpClientHandler() { 
                CookieContainer = cookieContainer,
                UseCookies = true };
            var httpClient = new HttpClient(httpClientHandler);
            httpClient.BaseAddress = new Uri(gitlabHost);

            var httpResponse = await httpClient.GetAsync("/users/sign_in");
            httpResponse.EnsureSuccessStatusCode();

            // hent ut CSRF token
            var responseContentString = await httpResponse.Content.ReadAsStringAsync();
            var authenticityToken = _ExtractAuthenticityTokenFromContentString(responseContentString);

            // prøver så å logge inn for å autentisere (da vil session cookie være autentisert)
            var gitlabProjectConfiguration = gitlabConfiguration.GetSection("Projects");
            string gitlabOpenDataUser = gitlabProjectConfiguration["OpenDataUsername"];
            string gitlabOpenDataPassword = gitlabProjectConfiguration["OpenDataPassword"];
            var loginContent = new StringContent($"user[login]={gitlabOpenDataUser}&user[password]={gitlabOpenDataPassword}",
                        Encoding.UTF8, "application/x-www-form-urlencoded");
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/users/sign_in");
            httpRequest.Content = loginContent;
            httpRequest.Headers.Add("X-CSRF-Token", authenticityToken);
            httpResponse = await httpClient.SendAsync(httpRequest);
            httpResponse.EnsureSuccessStatusCode();
            
            // besøker så siden for issue boards for å skaffe en ny token
            var issueBoardPage = $"{gitlabProject.path_with_namespace}/-/boards";
            httpRequest = new HttpRequestMessage(HttpMethod.Get, issueBoardPage);
            httpRequest.Headers.Add("X-CSRF-Token", authenticityToken);
            httpResponse = await httpClient.SendAsync(httpRequest);
            httpResponse.EnsureSuccessStatusCode();

            // hent ut ny token og legg til som default header
            responseContentString = await httpResponse.Content.ReadAsStringAsync();
            authenticityToken = _ExtractAuthenticityTokenFromContentString(responseContentString);
            Console.WriteLine(authenticityToken);
            httpClient.DefaultRequestHeaders.Add("X-CSRF-Token", authenticityToken);

            // da burde vi være logget inn og autentisert
            return httpClient;
        }

        private static string _ExtractAuthenticityTokenFromContentString(string content)
        {
            // prøver her å hente ut en CSRF token (authenticity token)
            // den finnes et sted i responsen på formatet:
            // <input type="hidden" name="authenticity_token" value="Utvm23ff6GV0cd1UM7Uan9HtHfZCF7pQtR2Gcw4j86j0wLIxGLijdvdlyJnSb6e7QZEuWa/GcmO6h6r0dLFTTg==" />
            // eller
            // <meta name="csrf-token" content="7OhcWfkixLA2Fi6xPaHYYKwYFyRW49irktxR25bqgrwJ7DYbmrJSpHmEZNwjJvdr7xqlTAx7OfMICnv2GFv2qw==" />
            string[] authenticityTokenSearchStrings = {
                "name=\"authenticity_token\" value =\"",
                "name=\"csrf-token\" content=\""
            };

            return authenticityTokenSearchStrings
                    .Select(s => (searchString: s, indexOfSearchString: content.IndexOf(s)))
                    .Where(s => s.indexOfSearchString != -1)
                    .Select(s => (searchString : s.searchString, indexOfSearchString: s.indexOfSearchString, indexOfNextQuotationMark: content.IndexOf('"', s.indexOfSearchString + s.searchString.Length)))
                    .Where(s => s.indexOfNextQuotationMark != -1)
                    .Select(s => (searchString : s.searchString, indexOfSearchString: s.indexOfSearchString, tokenLength: s.indexOfNextQuotationMark - s.indexOfSearchString - s.searchString.Length))
                    .Where(s => s.tokenLength > 0)
                    .Select(s => content.Substring(s.indexOfSearchString + s.searchString.Length, s.tokenLength))
                    .First();
        }
    }
}
