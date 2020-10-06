using NUnit.Framework;
using Microsoft.Extensions.Caching.Memory;
using OpenData.API.Persistence.Contexts;
using System.Data.Common;
using System.Threading.Tasks;
using OpenData.API.Services;
using OpenData.API.Persistence.Repositories;
using OpenData.API.Domain.Models;
using OpenData.API.Domain.Services.Communication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;

namespace Tests
{
    [TestFixture]
    public class DatasetServiceTests
    {
        protected TestDatabase TestDatabase { get; set; }


        [SetUp]
        public void Setup()
        {
            TestDatabase = new TestDatabase();
        }

        [TearDown]
        public void TearDown()
        {
            
        }

        [Test]
        public async Task TestFindById() 
        {
            using var context = new AppDbContext(TestDatabase.ContextOptions);
            context.AddTestData();

            DatasetService ds = new DatasetService(
                new DatasetRepository(context),
                new PublisherRepository(context),
                new CategoryRepository(context),
                new TagsRepository(context),
                new UnitOfWork(context),
                new MemoryCache(new MemoryCacheOptions()));
            Dataset example = new Dataset
            {
                Id = 104,
                Title = "Example",
                Identifier = "/api/datasets/104",
                Description = "Lorem Ipsum",
                PublicationStatus = EPublicationStatus.notPublished,
                DetailedPublicationStatus = EDetailedPublicationStatus.underEvaluation,
                PublisherId = 101,
                CategoryId = 100
            };

            DatasetResponse res;
            res = await ds.SaveAsync(example);
            Assert.IsTrue(res.Success);

            res = await ds.FindByIdAsync(example.Id);
            Assert.IsTrue(res.Success);
            Assert.AreEqual(example, res.Resource);

            res = await ds.FindByIdAsync(5); // Fails: DatasetRepository.FindByIdAsync uses FirstOrDefault, meaning it always returns a "Success", is this intentional?
            Assert.IsFalse(res.Success);
        }
    }
}