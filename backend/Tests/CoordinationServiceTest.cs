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
                PublisherId = 100
            };
        }
        [TearDown]
        public void TearDown()
        {
            //Context.Dispose();
        }
    }
}