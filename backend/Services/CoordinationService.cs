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
                coordination.DatePublished = DateTime.Now;
                coordination.DateLastUpdated = DateTime.Now;

                var createCoordinationTask = Task.Run(async() => {
                    coordination = await _coordinationRepository.AddAsync(coordination);
                    await _unitOfWork.CompleteAsync();
                    await addTags(coordination);
                    return coordination;
                });

                var gitlabProjectResponse = await await createCoordinationTask.ContinueWith((antecedent) => {
                    return _gitlabService.CreateGitlabProjectForCoordination(antecedent.Result);
                }, TaskContinuationOptions.OnlyOnRanToCompletion);

                if (gitlabProjectResponse.Success) {
                    coordination.GitlabProjectId = gitlabProjectResponse.Resource.id;
                    coordination.GitlabProjectPath = gitlabProjectResponse.Resource.full_path;
                    _coordinationRepository.Update(coordination);
                    await _unitOfWork.CompleteAsync();
                    return new CoordinationResponse(coordination);
                } else {
                    // TODO: hvis opprettelse av prosjekt i gitlab feiler bør coordination fjernes fra databasen
                    return new CoordinationResponse(gitlabProjectResponse.Message);
                }
            }
            catch(Exception ex)
            {
                return new CoordinationResponse($"An error occured when saving the coordination: {ex.Message}");
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

                existingCoordination.Title = coordination.Title;
                existingCoordination.Description = coordination.Description;
                existingCoordination.PublisherId = coordination.PublisherId;
                existingCoordination.UnderCoordination = coordination.UnderCoordination;
                existingCoordination.StatusDescription = coordination.StatusDescription;
                existingCoordination.CategoryId = coordination.CategoryId;
                existingCoordination.TagsIds = coordination.TagsIds;
                existingCoordination.DateLastUpdated = DateTime.Now;
                existingCoordination.AccessLevel = coordination.AccessLevel;

                existingCoordination.CoordinationTags.Clear();
                await addTags(existingCoordination);

                _coordinationRepository.Update(existingCoordination);

                await _notificationService.AddUserNotificationsAsync(existingCoordination, existingCoordination, existingCoordination.Title + " - " + existingCoordination.Publisher.Name, "Samordningen '" + existingCoordination.Title + "' har blitt oppdatert.");
                await _notificationService.AddPublisherNotificationsAsync(existingCoordination, existingCoordination, existingCoordination.Title + " - " + existingCoordination.Publisher.Name, "Samordningen din '" + existingCoordination.Title + "' har blitt oppdatert.");
                await _unitOfWork.CompleteAsync();

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

            patch.ApplyTo(coordination);
            coordination.DateLastUpdated = DateTime.Now;

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