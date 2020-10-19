using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;
using OpenData.API.Persistence.Contexts;
using OpenData.API.Persistence.Repositories;
using OpenData.API.Services;
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
                new PublisherRepository(Context),
                new CategoryRepository(Context),
                new TagsRepository(Context),
                new UnitOfWork(Context));
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