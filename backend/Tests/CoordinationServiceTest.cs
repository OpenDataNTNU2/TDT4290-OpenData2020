using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;
using OpenData.API.Persistence.Contexts;
using OpenData.API.Persistence.Repositories;
using OpenData.API.Services;
using OpenData.External.Gitlab.Services;
using System;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;

namespace Tests
{
    [TestFixture]
    public class CoordinationServiceTests
    {
        protected TestDatabase TestDatabase { get; set; }
        protected AppDbContext Context { get; set; }
        protected CoordinationService CS { get; set; }
        protected CoordinationResponse Res { get; set; }
        protected Coordination ExampleV { get; set; }

        [SetUp]
        public void Setup()
        {
            TestDatabase = new TestDatabase();
            Context = new AppDbContext(TestDatabase.ContextOptions);
            Context.AddTestData();
            CS = new CoordinationService(
                new CoordinationRepository(Context),
                new NotificationService(new NotificationRepository(Context), new UnitOfWork(Context)),
                new PublisherRepository(Context),
                new CategoryRepository(Context),
                new TagsRepository(Context),
                new UnitOfWork(Context),
                new GitlabService(new DatasetServiceTests.SoullessGitlabCLient(), new Microsoft.Extensions.Configuration.ConfigurationBuilder().Build()));
            ExampleV = new Coordination
            {
                Id = 103,
                Title = "Samordning av museumsdata",
                Description = "Dette er en samordning av data rundt museumer i kommunene: Bodø og Trondheim",
                PublisherId = 100,
                CategoryId = 100,
                UnderCoordination = false
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
            Res = await CS.FindByIdAsync(100); //Assumed correct from AddTestData
            Assert.IsTrue(Res.Success, "Object is not returned for correct test data ID");

            Res = await CS.FindByIdAsync(-100);
            Assert.IsFalse(Res.Success, "Object is returned for a negative ID");

            Res = await CS.FindByIdAsync(5);
            Assert.IsFalse(Res.Success, "Object is returned for an ID that should not exist");
        }

        [Test]
        public async Task TestSave()
        {
            Res = await CS.FindByIdAsync(ExampleV.Id);
            Assert.IsFalse(Res.Success, "Object ID is found before the object is saved");

            Res = await CS.SaveAsync(ExampleV);
            Assert.IsTrue(Res.Success, "Error when trying to save a valid object");

            Res = await CS.FindByIdAsync(ExampleV.Id);
            Assert.IsTrue(Res.Success, "Object was not found after being saved");
            Assert.AreEqual(ExampleV, Res.Resource, "Object returned on our examples ID is the wrong object");

            Res = await CS.FindByIdAsync(5);
            Assert.IsFalse(Res.Success, "Object is returned for an ID that should not exist");

            Coordination exampleI = new Coordination
            {
                Id = 1,
                Title = "Kjør",
                PublisherId = 100
            };

            Res = await CS.FindByIdAsync(exampleI.Id);
            Assert.IsFalse(Res.Success, "Object ID is found before the object is saved");

            Res = await CS.SaveAsync(exampleI);
            Assert.IsFalse(Res.Success, "Object was saved even though it should not be");

            Res = await CS.FindByIdAsync(exampleI.Id);
            Assert.IsFalse(Res.Success, "Object is returned for an ID that should not exist");
        }

        [Test]
        public async Task TestUpdate()
        {
            Res = await CS.FindByIdAsync(5);
            Assert.IsFalse(Res.Success);

            Res = await CS.UpdateAsync(5, ExampleV);
            Assert.IsFalse(Res.Success, "Success on updating on an ID that should not exist");

            Res = await CS.FindByIdAsync(100);
            Assert.IsTrue(Res.Success);
            Coordination exampleA = Res.Resource; // Should use clone()
            var exampleAImg = CoordinationSnapshot(exampleA); // CoordinationSnapshot is not a good function, and should be replaced by clone and equals in Coordination

            Res = await CS.UpdateAsync(100, ExampleV);
            Assert.IsTrue(Res.Success, "Failed to update an existing ID with a new valid state.");

            Coordination exampleB = Res.Resource;
            var exampleBImg = CoordinationSnapshot(exampleB);

            Assert.AreNotEqual(exampleAImg.Title, exampleB.Title, "Title before update is equal to title after update.");
            Assert.AreEqual(ExampleV.Title, exampleB.Title, "Updated title is not equal to inputted title.");
        }
        
        #pragma warning restore CS1998

        private
            (
                int Id,
                string Title,
                string Description,
                int PublisherId,
                bool UnderCoordination,
                string StatusDescription,
                int CategoryId,
                string TagsIds
            )
            CoordinationSnapshot(Coordination c)
        {
            return (
                   c.Id,
                   c.Title,
                   c.Description,
                   c.PublisherId,
                   c.UnderCoordination,
                   c.StatusDescription,
                   c.CategoryId,
                   c.TagsIds
                   );
        }
    }
}