using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Models.Queries;
using OpenData.API.Domain.Repositories;
using OpenData.API.Domain.Services;
using OpenData.API.Domain.Services.Communication;
using OpenData.API.Infrastructure;
using OpenData.External.Gitlab.Services;
using Microsoft.AspNetCore.JsonPatch;


namespace OpenData.API.Services
{
    public class CoordinationService : ICoordinationService
    {
        private readonly ICoordinationRepository _coordinationRepository;
        private readonly IPublisherRepository _publisherRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ITagsRepository _tagsRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGitlabService _gitlabService;

        public CoordinationService(ICoordinationRepository coordinationRepository,
                                   INotificationService notificationService,
                                   IPublisherRepository publisherRepository,
                                   ICategoryRepository categoryRepository,
                                   ITagsRepository tagsRepository,
                                   IUnitOfWork unitOfWork,
                                   IGitlabService gitlabService)
        {
            _coordinationRepository = coordinationRepository;
            _publisherRepository = publisherRepository;
            _categoryRepository = categoryRepository;
            _tagsRepository = tagsRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
            _gitlabService = gitlabService;
        }
        public async Task<QueryResult<Coordination>> ListAsync(CoordinationQuery query)
        {
            return await _coordinationRepository.ListAsync(query);
        }

        public async Task<CoordinationResponse> FindByIdAsync(int id)
        {
            try
            {
                var res = await _coordinationRepository.FindByIdAsync(id);
                if (res == null)
                {
                    return new CoordinationResponse("Invalid coordination id.");
                }
                return new CoordinationResponse(res);
            }
            catch (Exception ex)
            {
                return new CoordinationResponse($"An error occurred when trying to get the dataset: {ex.Message}");
            }
        }
        public async Task<CoordinationResponse> SaveAsync(Coordination coordination)
        {
            try
            {
                (Boolean success, String error) check = await idChecks(coordination);
                if (!check.success)
                {
                    return new CoordinationResponse(check.error);
                }
                // Sets the date and time for the attributes published and last updated to current time.
                coordination.DatePublished = DateTime.Now;
                coordination.DateLastUpdated = DateTime.Now;

                var createCoordinationTask = Task.Run(async() => {
                    coordination = await _coordinationRepository.AddAsync(coordination);
                    await _unitOfWork.CompleteAsync();
                    await addTags(coordination);
                    return coordination;
                });

                return await CreateGitLabProject(createCoordinationTask, coordination);
                
            }
            catch(Exception ex)
            {
                return new CoordinationResponse($"An error occured when saving the coordination: {ex.Message}");
            }
        }

        public async Task<CoordinationResponse> CreateGitLabProject(Task<Coordination> createCoordinationTask, Coordination coordination)
        {
            var gitlabProjectResponse = await await createCoordinationTask.ContinueWith((antecedent) => {
                return _gitlabService.CreateGitlabProjectForCoordination(antecedent.Result);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            if (gitlabProjectResponse.Success) {
                coordination.GitlabProjectId = gitlabProjectResponse.Resource.id;
                coordination.GitlabProjectPath = gitlabProjectResponse.Resource.path_with_namespace;
                coordination.GitlabDiscussionBoardId = gitlabProjectResponse.Resource.defaultGitlabIssueBoardId;
                _coordinationRepository.Update(coordination);
                await _unitOfWork.CompleteAsync();
                return new CoordinationResponse(coordination);
            } else {
                // Hvis opprettelse av prosjekt i gitlab feiler bør samordningen fjernes fra databasen
                _coordinationRepository.Remove(coordination);
                await _unitOfWork.CompleteAsync();
                return new CoordinationResponse(gitlabProjectResponse.Message);
            }
        }


        public async Task<CoordinationResponse> UpdateAsync(int id, Coordination coordination)
        {
            var existingCoordination = await _coordinationRepository.FindByIdAsync(id);

            if (existingCoordination == null)
                return new CoordinationResponse("Coordination not found.");

            try
            {
                (Boolean success, String error) check = await idChecks(coordination);
                if (!check.success)
                {
                    return new CoordinationResponse(check.error);
                }
                // Set last updated to current time
                existingCoordination.DateLastUpdated = DateTime.Now;

                // Update attributes
                existingCoordination.Title = coordination.Title;
                existingCoordination.Description = coordination.Description;
                existingCoordination.PublisherId = coordination.PublisherId;
                existingCoordination.UnderCoordination = coordination.UnderCoordination;
                existingCoordination.StatusDescription = coordination.StatusDescription;
                existingCoordination.CategoryId = coordination.CategoryId;
                existingCoordination.TagsIds = coordination.TagsIds;
                existingCoordination.AccessLevel = coordination.AccessLevel;

                existingCoordination.CoordinationTags.Clear();
                await addTags(existingCoordination);

                _coordinationRepository.Update(existingCoordination);

                // Send notifications
                await _notificationService.AddUserNotificationsAsync(existingCoordination, existingCoordination, existingCoordination.Title + " - " + existingCoordination.Publisher.Name, "Samordningen '" + existingCoordination.Title + "' har blitt oppdatert.");
                await _notificationService.AddPublisherNotificationsAsync(existingCoordination, existingCoordination, existingCoordination.Title + " - " + existingCoordination.Publisher.Name, "Samordningen din '" + existingCoordination.Title + "' har blitt oppdatert.");
                await _unitOfWork.CompleteAsync();

                if (coordination.GitlabProjectId == null)
                {
                    var createCoordinationTask = Task.Run(() => {
                        return existingCoordination;
                    });
                    await CreateGitLabProject(createCoordinationTask, existingCoordination);
                }
                await _gitlabService.UpdateProject(existingCoordination);

                return new CoordinationResponse(existingCoordination);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new CoordinationResponse($"An error occurred when updating the coordination: {ex.Message}");
            }
        }

        public async Task<CoordinationResponse> UpdateAsync(int id, JsonPatchDocument<Coordination> patch)
        {
            var coordination = await _coordinationRepository.FindByIdAsync(id);

            // Apply the update from the json patch document
            patch.ApplyTo(coordination);

            // Set last updated to current time
            coordination.DateLastUpdated = DateTime.Now;

            // Send notifications based on what was changed
            switch(patch.Operations[0].path)
            {
                case "/title":
                    await _notificationService.AddUserNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "En samordning du følger har endret tittel til '" + coordination.Title + "'.");
                    await _notificationService.AddPublisherNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "En samordningen du eier har endret tittel til '" + coordination.Title + "'.");
                    break;
                case "/description":
                    await _notificationService.AddUserNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen '" + coordination.Title + "' har endret beskrivelse.");
                    await _notificationService.AddPublisherNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen din '" + coordination.Title + "' har endret beskrivelse.");
                    break;
                case "/underCoordination":
                    await _notificationService.AddUserNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen '" + coordination.Title + "' har endret publiseringsstatus.");
                    await _notificationService.AddPublisherNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen din '" + coordination.Title + "' har endret publiseringsstatus.");
                    break;
                case "/categoryId":
                    await _notificationService.AddUserNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen '" + coordination.Title + "' har endret kategori.");
                    await _notificationService.AddPublisherNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen din '" + coordination.Title + "' har endret kategori.");
                    break;
                case "/tagsIds":
                    coordination.CoordinationTags.Clear();
                    await addTags(coordination);
                    await _notificationService.AddUserNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen '" + coordination.Title + "' har endret tags.");
                    await _notificationService.AddPublisherNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen din '" + coordination.Title + "' har endret tags.");
                    break;
                case "/accessLevel":
                    await _notificationService.AddUserNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen '" + coordination.Title + "' har endret tilgangsnivå til '" + coordination.AccessLevel + "'.");
                    await _notificationService.AddPublisherNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen din '" + coordination.Title + "' har endret tilgangsnivå til '" + coordination.AccessLevel + "'.");
                    break;
                default:
                    await _notificationService.AddUserNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen '" + coordination.Title + "' har blitt endret.");
                    await _notificationService.AddPublisherNotificationsAsync(coordination, coordination, coordination.Title + " - " + coordination.Publisher.Name, "Samordningen din '" + coordination.Title + "' har blitt endret.");
                    break;
            }

            await _unitOfWork.CompleteAsync();
            
            if (coordination.GitlabProjectId == null)
            {
                var createCoordinationTask = Task.Run(() => {
                    return coordination;
                });
                await CreateGitLabProject(createCoordinationTask, coordination);
            }
            await _gitlabService.UpdateProject(coordination);

            return new CoordinationResponse(coordination);
        }

        private async Task<(Boolean success,String error)> idChecks(Coordination coordination)
        {
            // Make sure the publisher exists
            var existingPublisher = await _publisherRepository.FindByIdAsync(coordination.PublisherId);
            if (existingPublisher == null)
                return (false, "Invalid publisher id.");

            // Make sure the category exists
            var existingCategory = await _categoryRepository.FindByIdAsync(coordination.CategoryId);
            if (existingCategory == null)
                return (false, "Invalid category id.");

            return (true, "Success.");
        }

        // Method to add tags based on the id and a bit messy because it is sent as a string.
        private async Task addTags(Coordination coordination)
        {
            try
            {
                // Tries to parse tag ids from string to int
                foreach (string idString in coordination.TagsIds.Split(','))
                {
                    if (idString == null || idString == "") continue;
                    int tagId = Int32.Parse(idString.Trim());
                    Tags existingTag = await _tagsRepository.FindByIdAsync(tagId);
                    if (existingTag != null)
                    {
                        // If the tag exists, add it to the list of tags in the coordination
                        CoordinationTags coordinationTag = new CoordinationTags { Coordination = coordination, Tags = existingTag };
                        coordination.CoordinationTags.Add(coordinationTag);
                    }
                }
                await _unitOfWork.CompleteAsync();
            }
            catch (Exception ex)
            {
                await _unitOfWork.CompleteAsync();
                Console.WriteLine(ex.Message);
            }
        }
    }
}
