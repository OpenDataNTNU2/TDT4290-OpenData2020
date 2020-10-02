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

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<Publisher>().ToTable("Publishers");
            builder.Entity<Publisher>().HasKey(p => p.Id);
            builder.Entity<Publisher>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Publisher>().Property(p => p.Name).IsRequired();

            builder.Entity<Publisher>().HasData(
                new Publisher { Id = 100, Name = "Trondheim kommune" },
                new Publisher { Id = 101, Name = "Bodø kommune" }
            );

            builder.Entity<User>().ToTable("Users");
            builder.Entity<User>().HasKey(p => p.Id);
            builder.Entity<User>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<User>().Property(p => p.Username).IsRequired();

            builder.Entity<User>().HasData(
                new User { Id = 100, Username = "test_trondheim_kommune", PublisherId = 100 },
                new User { Id = 101, Username = "test_bodø_kommune", PublisherId = 101 }
            );
            
            builder.Entity<Dataset>().ToTable("Datasets");
            builder.Entity<Dataset>().HasKey(p => p.Id);
            builder.Entity<Dataset>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();//.HasValueGenerator<InMemoryIntegerValueGenerator<int>>();
            builder.Entity<Dataset>().Property(p => p.Identifier).IsRequired();
            builder.Entity<Dataset>().Property(p => p.Title).IsRequired().HasMaxLength(60);
            builder.Entity<Dataset>().HasMany(p => p.Distributions).WithOne(p => p.Dataset).HasForeignKey(p => p.DatasetId);

            builder.Entity<Dataset>().HasData
            (
                new Dataset { 
                    Id = 100, 
                    Title = "Strand", 
                    Identifier = "/api/datasets/100", 
                    Description = "Strender i Trondheim", 
                    PublicationStatus = EPublicationStatus.published, 
                    PublisherId = 100
                }, // Id set manually due to in-memory provider
                new Dataset { 
                    Id = 101, 
                    Title = "Strand", 
                    Identifier = "/api/datasets/101", 
                    Description = "Strender i Bodø", 
                    PublicationStatus = EPublicationStatus.notPublished,
                    DetailedPublicationStatus = EDetailedPublicationStatus.underEvaluation, 
                    PublisherId = 101
                }
            );

            builder.Entity<Distribution>().ToTable("Distributions");
            builder.Entity<Distribution>().HasKey(p => p.Id);
            builder.Entity<Distribution>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Distribution>().Property(p => p.Title).IsRequired().HasMaxLength(60);
            builder.Entity<Distribution>().Property(p => p.DatasetId).IsRequired();

            builder.Entity<Distribution>().HasData
            (
                new Distribution
                {
                    Id = 100,
                    Title = "URL til json fil",
                    DatasetId = 100,
                    Uri = "http://www.opendata.no/files/100.json",
                    FileFormat = EFileFormat.json
                },
                new Distribution
                {
                    Id = 101,
                    Title = "URL til xml fil",
                    DatasetId = 101,
                    Uri = "http://www.opendata.no/files/101.xml",
                    FileFormat = EFileFormat.xml
                }
            );
            builder.Entity<Tags>().ToTable("Tags");
            builder.Entity<Tags>().HasKey(p => p.Id);
            builder.Entity<Tags>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Tags>().Property(p => p.Name).IsRequired();
            builder.Entity<Tags>().HasData
            (
                new Tags
                {
                    Id = 100,
                    Name = "Culture"
                },
                new Tags
                {
                    Id = 101,
                    Name = "Bicycle"
                }
            );
            builder.Entity<DatasetTags>().ToTable("DatasetTags");
            builder.Entity<DatasetTags>().HasData
            (
                new DatasetTags
                {
                    DatasetId = 100,
                    TagsId = 100
                },
                new DatasetTags
                {
                    DatasetId = 101,
                    TagsId = 101
                }
            );
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
            
        }
    }
}