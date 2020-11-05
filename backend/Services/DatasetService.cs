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
using OpenData.External.Gitlab.Services.Communication;
using OpenData.External.Gitlab.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace OpenData.API.Services
{
    public class DatasetService : IDatasetService
    {
        private readonly IDatasetRepository _datasetRepository;
        private readonly IPublisherRepository _publisherRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ICoordinationRepository _coordinationRepository;
        private readonly ITagsRepository _tagsRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;
        private readonly INotificationService _notificationService;
        private readonly IGitlabService _gitlabService;


        public DatasetService(IDatasetRepository datasetRepository, INotificationService notificationService, IPublisherRepository publisherRepository, ICategoryRepository categoryRepository, ICoordinationRepository coordinationRepository, ITagsRepository tagsRepository, IUnitOfWork unitOfWork, IMemoryCache cache, IGitlabService gitlabService)
        {
            _datasetRepository = datasetRepository;
            _publisherRepository = publisherRepository;
            _categoryRepository = categoryRepository;
            _coordinationRepository = coordinationRepository;
            _tagsRepository = tagsRepository;
            _unitOfWork = unitOfWork;
            _notificationService = notificationService;
            _cache = cache;
            _gitlabService = gitlabService;
        }

        public async Task<QueryResult<Dataset>> ListAsync(DatasetQuery query)
        {
            // Here I try to get the datasets list from the memory cache. If there is no data in cache, the anonymous method will be
            // called, setting the cache to expire one minute ahead and returning the Task that lists the datasets from the repository.

            // var datasets = await _cache.GetOrCreateAsync(CacheKeys.DatasetList, (entry) => {
            //     entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(0.01);
            //     return _datasetRepository.ListAsync();
            // });

            return await _datasetRepository.ListAsync(query);
        }

        public async Task<DatasetResponse> FindByIdAsync(int id)
        {
            try
            {
                var res = await _datasetRepository.FindByIdAsync(id);
                if (res == null)
                {
                    return new DatasetResponse("Invalid dataset id.");
                }
                return new DatasetResponse(res);
            }
            catch (Exception ex)
            {
                return new DatasetResponse($"An error occurred when trying to get the dataset: {ex.Message}");
            }
        }

        public async Task<DatasetResponse> SaveAsync(Dataset dataset)
        {
            try
            {
                (Boolean success, String error) check = await idChecks(dataset);
                if (!check.success)
                {
                    return new DatasetResponse(check.error);
                }
                dataset.DatePublished = DateTime.Now;
                dataset.DateLastUpdated = DateTime.Now;

                var createDatasetTask = Task.Run(async() => {
                    dataset = await _datasetRepository.AddAsync(dataset);
                    await addTags(dataset);
                    // NOTE: TODO: Config
                    dataset.Identifier = "https://katalog.samåpne.no/api/datasets/" + dataset.Id;
                    _datasetRepository.Update(dataset);
                    await _unitOfWork.CompleteAsync();
                    return dataset;
                });
                
                return await CreateGitLabProject(createDatasetTask, dataset);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new DatasetResponse($"An error occurred when saving the dataset: {ex.Message}");
            }
        }

        public async Task<DatasetResponse> CreateGitLabProject(Task<Dataset> createDatasetTask, Dataset exsistingDataset)
        {
            // NOTE: Her venter jeg på at datasettet skal opprettes uten feil,
            // før det opprettes i gitlab, for å hindre at det eksisterer løse prosjekter
            // i gitlab.
            // Dette kan kanskje gjøres smoothere.
            var gitlabProjectResponse = await await createDatasetTask.ContinueWith(async(antecedent) => {
                var dataset = antecedent.Result;

                var publisher = await _publisherRepository.FindByIdAsync(dataset.PublisherId);

                // NOTE: Enn så lenge så må vi verifisere at det eksisterer en gitlab-gruppe for publisher
                // før vi kan lage et prosjekt i riktig gruppe. I produksjon vil ikke dette være nødvendig,
                // og det bør heller ikke kjøre, fordi hvis det ikke eksisterer betyr det at noe har gått
                // galt ved opprettelse av publisher. (TODO: ordne dette en gang)
                if (publisher.GitlabGroupNamespaceId == null) {
                    var gitlabGroupResponse = await _gitlabService.CreateGitlabGroupForPublisher(publisher);
                    if (gitlabGroupResponse.Success) {
                        publisher.GitlabGroupPath = gitlabGroupResponse.Resource.full_path;
                        publisher.GitlabGroupNamespaceId = gitlabGroupResponse.Resource.id;
                        _publisherRepository.Update(publisher);
                        await _unitOfWork.CompleteAsync();
                    } else {
                        // hvis vi havner her så har ting gått veldig galt. (Dette er midlertidige saker uansett.)
                        // typisk skjer dette hvis det allerede eksisterer en gruppe i gitlab for publisher,
                        // men dette er ikke reflektert i databasen.
                        return new GitlabResponse<GitlabProject>(gitlabGroupResponse.Message + " ======> Noe har gått veldig galt med sære ting: Nei, vil ikke (Erna Solberg, 2018)");
                    }
                }

                return await _gitlabService.CreateDatasetProject(dataset);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            if (gitlabProjectResponse.Success) {
                exsistingDataset.GitlabProjectId = gitlabProjectResponse.Resource.id;
                exsistingDataset.GitlabProjectPath = gitlabProjectResponse.Resource.path_with_namespace;
                _datasetRepository.Update(exsistingDataset);
                await _unitOfWork.CompleteAsync();
                return new DatasetResponse(exsistingDataset);
            } else {
                // Hvis opprettelse av prosjekt i gitlab feiler bør datasettet fjernes fra databasen
                // Denne kan nå også potensielt fjerne eksisterende datasett som ikke enda har fått en gitlab tilknytting om det oppstår en feil
                _datasetRepository.Remove(exsistingDataset);
                await _unitOfWork.CompleteAsync();
                return new DatasetResponse("GitLab project response failed:" + gitlabProjectResponse.Message);
            }
        }

        public async Task<DatasetResponse> UpdateAsync(int id, Dataset dataset)
        {
            var existingDataset = await _datasetRepository.FindByIdAsync(id);

            if (existingDataset == null)
                return new DatasetResponse("Dataset not found.");

            try
            {
                (Boolean success, String error) check = await idChecks(dataset);
                if (!check.success)
                {
                    return new DatasetResponse(check.error);
                }
                // Update attributes
                existingDataset.Title = dataset.Title; 
                existingDataset.Description = dataset.Description; 
                existingDataset.DateLastUpdated = DateTime.Now;
                existingDataset.PublisherId = dataset.PublisherId; 
                existingDataset.PublicationStatus = dataset.PublicationStatus; 
                existingDataset.DatePlannedPublished = dataset.DatePlannedPublished; 
                existingDataset.AccessLevel = dataset.AccessLevel; 
                existingDataset.TagsIds = dataset.TagsIds; 
                existingDataset.CategoryId = dataset.CategoryId; 
                existingDataset.CoordinationId = dataset.CoordinationId;
                existingDataset.InterestCounter = dataset.InterestCounter;

                existingDataset.DatasetTags.Clear();
                await addTags(existingDataset);

                _datasetRepository.Update(existingDataset);

                await _notificationService.AddUserNotificationsAsync(existingDataset, existingDataset, existingDataset.Title + " - " + existingDataset.Publisher.Name, "Datasettet '" + existingDataset.Title + "' har blitt oppdatert.");
                await _notificationService.AddPublisherNotificationsAsync(existingDataset, existingDataset, existingDataset.Title + " - " + existingDataset.Publisher.Name, "Datasettet ditt '" + existingDataset.Title + "' har blitt oppdatert.");
                await _unitOfWork.CompleteAsync();

                if (dataset.GitlabProjectId == null) {
                    var createDatasetTask = Task.Run(() => {
                        return existingDataset;
                    });
                    await CreateGitLabProject(createDatasetTask, existingDataset);
                }
                await _gitlabService.UpdateProject(existingDataset);

                return new DatasetResponse(existingDataset);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new DatasetResponse($"An error occurred when updating the dataset: {ex.Message}");
            }
        }

        public async Task<DatasetResponse> UpdateAsync(int id, JsonPatchDocument<Dataset> patch)
        {
            var dataset = await _datasetRepository.FindByIdAsync(id);

            patch.ApplyTo(dataset);
            dataset.DateLastUpdated = DateTime.Now;

            switch (patch.Operations[0].path)
            {
                case "/coordinationId":
                    await _notificationService.AddUserNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet '" + dataset.Title + "' har blitt med i en samordning.");
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet ditt '" + dataset.Title + "' har blitt med i en samordning.");
                    break;
                case "/interestCounter":
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Noen har vist interesse for det upubliserte datasettet ditt '" + dataset.Title + "' som nå har " + dataset.InterestCounter + " interesserte.");
                    break;
                case "/title":
                    await _notificationService.AddUserNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Et datasett du abonnerer på har endret tittel til '" + dataset.Title + "'.");
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Et datasett du eier har endret tittel til '" + dataset.Title + "'.");
                    break;
                case "/description":
                    await _notificationService.AddUserNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet '" + dataset.Title + "' har endret beskrivelse.");
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet ditt '" + dataset.Title + "' har endret beskrivelse.");
                    break;
                case "/publicationStatus":
                    await _notificationService.AddUserNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet '" + dataset.Title + "' har endret publiseringsstatus til '" + dataset.PublicationStatus + "'.");
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet ditt '" + dataset.Title + "' har endret publiseringsstatus til '" + dataset.PublicationStatus + "'.");
                    break;
                case "/accessLevel":
                    await _notificationService.AddUserNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet '" + dataset.Title + "' har endret tilgangsnivå til '" + dataset.AccessLevel + "'.");
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet ditt '" + dataset.Title + "' har endret tilgangsnivå til '" + dataset.AccessLevel + "'.");
                    break;
                case "/categoryId":
                    await _notificationService.AddUserNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet '" + dataset.Title + "' har endret kategori.");
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet ditt '" + dataset.Title + "' har endret kategori.");
                    break;
                case "/tagsIds":
                    dataset.DatasetTags.Clear();
                    await addTags(dataset);
                    await _notificationService.AddUserNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet '" + dataset.Title + "' har endret tags.");
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet ditt '" + dataset.Title + "' har endret tags.");
                    break;
                default:
                    await _notificationService.AddUserNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet '" + dataset.Title + "' har blitt endret.");
                    await _notificationService.AddPublisherNotificationsAsync(dataset, dataset, dataset.Title + " - " + dataset.Publisher.Name, "Datasettet ditt '" + dataset.Title + "' har blitt endret.");
                    break;
            }

            await _unitOfWork.CompleteAsync();

            if (dataset.GitlabProjectId == null) 
            {
                var createDatasetTask = Task.Run(() => {
                    return dataset;
                });
                await CreateGitLabProject(createDatasetTask, dataset);
            }
            await _gitlabService.UpdateProject(dataset);
            
            return new DatasetResponse(dataset);
        }

        public async Task<DatasetResponse> DeleteAsync(int id)
        {
            var existingDataset = await _datasetRepository.FindByIdAsync(id);

            if (existingDataset == null)
                return new DatasetResponse("Dataset not found.");

            try
            {
                _datasetRepository.Remove(existingDataset);
                await _unitOfWork.CompleteAsync();

                return new DatasetResponse(existingDataset);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new DatasetResponse($"An error occurred when deleting the dataset: {ex.Message}");
            }
        }

        private async Task<(Boolean success,String error)> idChecks(Dataset dataset)
        {
            // Make sure the publisher exists
            var existingPublisher = await _publisherRepository.FindByIdAsync(dataset.PublisherId);
            if (existingPublisher == null)
                return (false, "Invalid publisher id.");

            // Make sure the category exists
            var existingCategory = await _categoryRepository.FindByIdAsync(dataset.CategoryId);
            if (existingCategory == null)
                return (false, "Invalid category id.");

            // Make sure the coordination exists if present
            if (dataset.CoordinationId != null)
            {
                var existingCoordination = await _coordinationRepository.FindByIdAsync((int)dataset.CoordinationId);
                if (existingCoordination == null)
                    return (false, "Invalid coordination id.");
            }
            return (true, "Success.");
        }

        private async Task addTags(Dataset dataset)
        {
            try
            {
                // Tries to parse tag ids from string to int
                foreach (string idString in dataset.TagsIds.Split(','))
                {
                    if (idString == null || idString == "") continue;
                    int id = Int32.Parse(idString.Trim());
                    Tags existingTag = await _tagsRepository.FindByIdAsync(id);
                    if (existingTag != null)
                    {
                        // If the tag exists, add it to the list of tags in the dataset
                        DatasetTags datasetTag = new DatasetTags { Dataset = dataset, Tags = existingTag };
                        dataset.DatasetTags.Add(datasetTag);
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
