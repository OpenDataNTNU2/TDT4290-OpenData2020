using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory.ValueGeneration.Internal;
using OpenData.API.Domain.Models;

namespace OpenData.API.Persistence.Contexts
{
    public class AppDbContext : DbContext
    {
        public DbSet<Dataset> Datasets { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Distribution> Distributions { get; set; }
        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<Tags> Tags { get; set; }
        public DbSet<DatasetTags> DatasetTags { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Coordination> Coordinations { get; set; }
        public DbSet<CoordinationTags> CoordinationTags { get; set; }
        public DbSet<Application> Applications { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<Publisher>().ToTable("Publishers");
            builder.Entity<Publisher>().HasKey(p => p.Id);
            builder.Entity<Publisher>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Publisher>().Property(p => p.Name).IsRequired();
            builder.Entity<Publisher>().HasMany(p => p.Datasets).WithOne(p => p.Publisher).HasForeignKey(p => p.PublisherId);
            builder.Entity<Publisher>().HasMany(p => p.Coordinations).WithOne(p => p.Publisher).HasForeignKey(p => p.PublisherId);

            builder.Entity<User>().ToTable("Users");
            builder.Entity<User>().HasKey(p => p.Id);
            builder.Entity<User>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<User>().Property(p => p.Username).IsRequired();

            builder.Entity<Category>().ToTable("Categories");
            builder.Entity<Category>().HasKey(p => p.Id);
            builder.Entity<Category>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Category>().Property(p => p.Name).IsRequired().HasMaxLength(60);
            builder.Entity<Category>().HasMany(p => p.Datasets).WithOne(p => p.Category).HasForeignKey(p => p.CategoryId);

            builder.Entity<Dataset>().ToTable("Datasets");
            builder.Entity<Dataset>().HasKey(p => p.Id);
            builder.Entity<Dataset>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();//.HasValueGenerator<InMemoryIntegerValueGenerator<int>>();
            builder.Entity<Dataset>().Property(p => p.Identifier).IsRequired();
            builder.Entity<Dataset>().Property(p => p.Title).IsRequired().HasMaxLength(60);
            builder.Entity<Dataset>().Property(p => p.PublisherId).IsRequired();
            builder.Entity<Dataset>().Property(p => p.CategoryId).IsRequired();
            builder.Entity<Dataset>().HasMany(p => p.Distributions).WithOne(p => p.Dataset).HasForeignKey(p => p.DatasetId);
            builder.Entity<Dataset>()
            .HasMany(p => p.Applications)
            .WithOne(p => p.Dataset)
            .HasForeignKey(p => p.DatasetId);

            builder.Entity<Distribution>().ToTable("Distributions");
            builder.Entity<Distribution>().HasKey(p => p.Id);
            builder.Entity<Distribution>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Distribution>().Property(p => p.Title).IsRequired().HasMaxLength(60);
            builder.Entity<Distribution>().Property(p => p.DatasetId).IsRequired();

            builder.Entity<Tags>().ToTable("Tags");
            builder.Entity<Tags>().HasKey(p => p.Id);
            builder.Entity<Tags>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Tags>().Property(p => p.Name).IsRequired();

            builder.Entity<DatasetTags>().ToTable("DatasetTags");

            builder.Entity<DatasetTags>()
                .HasKey(dt => new { dt.DatasetId, dt.TagsId });
            builder.Entity<DatasetTags>()
                .HasOne(dt => dt.Dataset)
                .WithMany(d => d.DatasetTags)
                .HasForeignKey(dt => dt.DatasetId);
            builder.Entity<DatasetTags>()
                .HasOne(dt => dt.Tags)
                .WithMany(t => t.DatasetTags)
                .HasForeignKey(dt => dt.TagsId);

            builder.Entity<CoordinationTags>().ToTable("CoordinationTags");

            builder.Entity<CoordinationTags>()
                .HasKey(dt => new { dt.CoordinationId, dt.TagsId });
            builder.Entity<CoordinationTags>()
                .HasOne(dt => dt.Coordination)
                .WithMany(d => d.CoordinationTags)
                .HasForeignKey(dt => dt.CoordinationId);
            builder.Entity<CoordinationTags>()
                .HasOne(dt => dt.Tags)
                .WithMany(t => t.CoordinationTags)
                .HasForeignKey(dt => dt.TagsId);

            builder.Entity<Coordination>().ToTable("Coordinations");
            builder.Entity<Coordination>().HasKey(p => p.Id);
            builder.Entity<Coordination>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Coordination>().Property(p => p.Title).IsRequired();
            builder.Entity<Coordination>().Property(p => p.PublisherId).IsRequired();
            builder.Entity<Coordination>().Property(p => p.CategoryId).IsRequired();
            builder.Entity<Coordination>().Property(p => p.UnderCoordination).HasDefaultValue(false);
            builder.Entity<Coordination>()
            .HasMany(p => p.Datasets)
            .WithOne(p => p.Coordination)
            .HasForeignKey(p => p.CoordinationId);
            builder.Entity<Coordination>()
            .HasMany(p => p.Applications)
            .WithOne(p => p.Coordination)
            .HasForeignKey(p => p.CoordinationId);

            builder.Entity<Application>().ToTable("Applications");
            builder.Entity<Application>().HasKey(p => p.Id);
            builder.Entity<Application>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Application>().Property(p => p.Reason).IsRequired();
            builder.Entity<Application>().Property(p => p.DatasetId).IsRequired();
            builder.Entity<Application>().Property(p => p.CoordinationId).IsRequired();
        }

        public void AddTestData()
        {
            Publisher trondheimPublisher = new Publisher
            {
                Id = 100,
                Name = "Trondheim kommune"
            };
            Publisher bodoPublisher = new Publisher
            {
                Id = 101,
                Name = "Bodø kommune"
            };
            AddRange(trondheimPublisher, bodoPublisher);

            User trondheimUser = new User
            {
                Id = 100,
                Username = "test_trondheim_kommune",
                PublisherId = 100
            };
            User bodoUser = new User
            {
                Id = 101,
                Username = "test_bodø_kommune",
                PublisherId = 101
            };
            AddRange(trondheimUser, bodoUser);

            Category landskap = new Category
            {
                Id = 100,
                Name = "Landskap"
            };
            Category kultur = new Category
            {
                Id = 101,
                Name = "Kultur"
            };
            Category theater = new Category
            {
                Id = 102,
                BroaderId = 101,
                Name = "Theater"
            };
            AddRange(landskap, kultur, theater);

            Dataset strandTrondheim = new Dataset
            {
                Id = 100,
                Title = "Strand",
                Identifier = "/api/datasets/100",
                Description = "Strender i Trondheim",
                DateLastUpdated = System.DateTime.Parse("2019-07-04"),
                PublicationStatus = EPublicationStatus.published,
                AccessLevel = EAccessLevel.green,
                PublisherId = 100,
                CategoryId = 100,
                InterestCounter = 0
            }; // Id set manually due to in-memory provider
            Dataset strandBodo = new Dataset
            {
                Id = 101,
                Title = "Strand",
                Identifier = "/api/datasets/101",
                Description = "Strender i Bodø",
                DateLastUpdated = System.DateTime.Parse("2020-11-24"),
                PublicationStatus = EPublicationStatus.plannedPublished,
                DatePlannedPublished = System.DateTime.Parse("2020-10-15"),
                AccessLevel = EAccessLevel.yellow,
                PublisherId = 101,
                CategoryId = 100,
                InterestCounter = 0
            };
            AddRange(strandTrondheim, strandBodo);

            Distribution jsonDist = new Distribution
            {
                Id = 100,
                Title = "URL til json fil",
                DatasetId = 100,
                Uri = "http://www.opendata.no/files/100.json",
                FileFormat = EFileFormat.json
            };
            Distribution xmlDist = new Distribution
            {
                Id = 101,
                Title = "URL til xml fil",
                DatasetId = 101,
                Uri = "http://www.opendata.no/files/101.xml",
                FileFormat = EFileFormat.xml
            };
            AddRange(jsonDist, xmlDist);

            Tags cultureTag = new Tags
            {
                Id = 100,
                Name = "Culture"
            };
            Tags bicycleTag = new Tags
            {
                Id = 101,
                Name = "Bicycle"
            };
            AddRange(cultureTag, bicycleTag);

            DatasetTags cultureDataTag = new DatasetTags
            {
                DatasetId = 100,
                TagsId = 100
            };
            DatasetTags bicycleDataTag = new DatasetTags
            {
                DatasetId = 101,
                TagsId = 101
            };
            AddRange(cultureDataTag, bicycleDataTag);
            
            CoordinationTags cultureCoordTag = new CoordinationTags
            {
                CoordinationId = 100,
                TagsId = 100
            };
            CoordinationTags bicycleCoordTag = new CoordinationTags
            {
                CoordinationId = 101,
                TagsId = 101
            };
            AddRange(cultureCoordTag, bicycleCoordTag);

            Coordination bicycleCoordination = new Coordination
            {
                Id = 100,
                Title = "Bicycle coordination",
                Description = "Dette er en samordning av datasett om strender",
                PublisherId = 101,
                CategoryId = 101
            };

            Coordination beachCoordination = new Coordination
            {
                Id = 101,
                Title = "Strand samordning",
                Description = "Dette er en samordning av datasett om strender",
                PublisherId = 100,
                CategoryId = 101
            };
            AddRange(bicycleCoordination, beachCoordination);

            SaveChanges();
        }
    }
}