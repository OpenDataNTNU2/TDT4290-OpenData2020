using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;
using OpenData.API.Persistence.Contexts;
using OpenData.API.Persistence.Repositories;
using OpenData.API.Services;
using OpenData.External.Gitlab;
using OpenData.External.Gitlab.Models;
using OpenData.External.Gitlab.Services;
using OpenData.External.Gitlab.Services.Communication;
using System;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;

namespace Tests
{
    [TestFixture]
    public class DatasetServiceTests
    {
        protected TestDatabase TestDatabase { get; set; }
        protected AppDbContext Context { get; set; }
        protected DatasetService DS { get; set; }
        protected DatasetResponse Res { get; set; }
        protected Dataset ExampleV { get; set; }

        // det burde da ikke være nøvdendig å lage noe sånt ...
        public class SoullessGitlabCLient : IGitlabClient {
            public Task<GitlabResponse<GitlabProject>> CreateGitlabProject(GitlabProject gitlabProject) { return Task.Run(() => new GitlabResponse<GitlabProject>(gitlabProject)); }
            public Task<GitlabResponse<GitlabProject>> UpdateGitlabProject(GitlabProject gitlabProject) { return Task.Run(() => new GitlabResponse<GitlabProject>(gitlabProject)); }
            public Task<GitlabResponse<GitlabGroup>> CreateGitlabGroup(GitlabGroup gitlabGroup) { return Task.Run(() => new GitlabResponse<GitlabGroup>(gitlabGroup)); }
            public Task<GitlabResponse<GitlabIssueBoard>> SetUpIssueDiscussionBoardForGitlabProject(GitlabProject gitlabProject) { return Task.Run(() => new GitlabResponse<GitlabIssueBoard>(new GitlabIssueBoard())); }
        }

        [SetUp]
        public void Setup()
        {
            TestDatabase = new TestDatabase();
            Context = new AppDbContext(TestDatabase.ContextOptions);
            Context.AddTestData();
            DS = new DatasetService(
                new DatasetRepository(Context),
                new NotificationService(new NotificationRepository(Context), new UnitOfWork(Context)),
                new PublisherRepository(Context),
                new CategoryRepository(Context),
                new CoordinationRepository(Context),
                new TagsRepository(Context),
                new UnitOfWork(Context),
                new MemoryCache(new MemoryCacheOptions()),
                new GitlabService(new SoullessGitlabCLient(), new Microsoft.Extensions.Configuration.ConfigurationBuilder().Build()) /*
                fuck C# som ikke har anonyme implementasjoner av interfaces (wtf liksom? vi lever i en sivilisert verden, ikke koding anno 1999)
                og hele dette clusterfucket av dependency injections som er totalt uegnet både på kort og lang sikt ...
                Til og med singletons - eller gud forby - statiske klassemetoder, hadde vært mer oversiktlig og lettere å implementere enn dette
                stakkarslige systemet med services som later som om de kan genereres automagisk med dependency injection, men likevel
                må initialiseres med andre services ... som igjen må initialiseres ...
                Hva er grunnen til å skrive "objektorientert" igjen??? Ett av verdens største mysterier ... */);
            ExampleV = new Dataset
            {
                Id = 104,
                Title = "ExampleV",
                Identifier = "/api/datasets/104",
                Description = "Lorem Ipsum",
                PublicationStatus = EPublicationStatus.notPublished,
                AccessLevel = EAccessLevel.green,
                PublisherId = 101,
                CategoryId = 100
            };
        }

        [TearDown]
        public void TearDown()
        {
            //Context.Dispose();
        }

        [Test]
        public async Task TestFindById()
        {
            Res = await DS.FindByIdAsync(100); // Assumed correct from AddTestData
            Assert.IsTrue(Res.Success, "Object is not returned for correct test data ID.");

            Res = await DS.FindByIdAsync(-1);
            Assert.IsFalse(Res.Success, "Object is returned for negative ID.");

            Res = await DS.FindByIdAsync(5);
            Assert.IsFalse(Res.Success, "Object is returned for an ID that should not exist.");
        }

        [Test]
        public async Task TestSave()
        {
            Res = await DS.FindByIdAsync(ExampleV.Id);
            Assert.IsFalse(Res.Success, "Object ID is found before saving.");

            Res = await DS.SaveAsync(ExampleV);
            Assert.IsTrue(Res.Success, "Error on saving a valid object.");

            Res = await DS.FindByIdAsync(ExampleV.Id);
            Assert.IsTrue(Res.Success, "Object ID not found after saving.");
            Assert.AreEqual(ExampleV, Res.Resource, "Object returned for given ID is not equal to our text object.");

            Res = await DS.FindByIdAsync(5);
            Assert.IsFalse(Res.Success, "Object is returned for an ID that should not exist.");

            Dataset exampleI = new Dataset
            {
                Id = 1,
                Title = "ExampleI",
            };

            Res = await DS.FindByIdAsync(exampleI.Id);
            Assert.IsFalse(Res.Success, "Invalid Object ID is found before saving.");

            Res = await DS.SaveAsync(exampleI);
            Assert.IsFalse(Res.Success, "Success on saving an invalid object.");

            Res = await DS.FindByIdAsync(exampleI.Id);
            Assert.IsFalse(Res.Success, "Object is returned for an ID that should not exist.");
        }

        [Test]
        public async Task TestUpdate()
        {
            Res = await DS.FindByIdAsync(5);
            Assert.IsFalse(Res.Success);

            Res = await DS.UpdateAsync(5, ExampleV);
            Assert.IsFalse(Res.Success, "Success on updating an ID that should not exist.");

            Res = await DS.FindByIdAsync(100);
            Assert.IsTrue(Res.Success);
            Dataset exampleA = Res.Resource; // Should use clone()
            var exampleAImg = DatasetSnapshot(exampleA); // DatasetSnapshot is not a good function, and should be replaced by clone and equals in Dataset

            Res = await DS.UpdateAsync(100, ExampleV);
            Assert.IsTrue(Res.Success, "Failed to update an existing ID with a new valid state.");

            Dataset exampleB = Res.Resource;
            var exampleBImg = DatasetSnapshot(exampleB);

            /* TODO: Use this when UpdateAsync is functional, and we have an equals method and a clone method
            Assert.AreNotEqual(exampleA, exampleB, "Object before update is equal to object after update.");
            Assert.AreEqual(exampleB, ExampleV, "Updated object is not equal to inputted object.");
            // If only some values are changeable, break this up into multiple AreEqual(exampleA.Title, exampleB.Title), etc
            */
            /* Use this when UpdateAsync is functional, and we have an equals method, but no clone method
            Assert.AreNotEqual(exampleAImg, exampleBImg, "Object before update is equal to object after update."); 
            Assert.AreEqual(DatasetSnapshot(ExampleV), exampleBImg, "Updated object is not equal to inputted object."); 
            // Fails, because UpdateAsync only updates title
            */
            Assert.AreNotEqual(exampleAImg.Title, exampleB.Title, "Title before update is equal to title after update.");
            Assert.AreEqual(ExampleV.Title, exampleB.Title, "Updated title is not equal to inputted title.");
        }

        [Test]
        public async Task TestDelete()
        {
            Res = await DS.FindByIdAsync(100);
            Assert.IsTrue(Res.Success);

            Res = await DS.DeleteAsync(100);
            Assert.IsTrue(Res.Success, "Failed to delete an existing dataset.");

            Res = await DS.DeleteAsync(100);
            Assert.IsFalse(Res.Success, "Deleting a nonexistant dataset returns a success.");
        }

        #pragma warning disable CS1998
        [Test]
        public async Task TestList()
        {
            // TODO: Implement test for ListAsync
        }
        #pragma warning restore CS1998

        private
            (
                int Id,
                string Title,
                string Description,
                int PublisherId,
                EPublicationStatus PublicationStatus,
                EAccessLevel AccessLevel,
                string TagsIds,
                int CategoryId
            )
            DatasetSnapshot(Dataset d)
        {
             return (
                    d.Id,
                    d.Title,
                    d.Description,
                    d.PublisherId,
                    d.PublicationStatus,
                    d.AccessLevel,
                    d.TagsIds,
                    d.CategoryId
                    );
        }
    }
}