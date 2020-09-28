using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory.ValueGeneration.Internal;
using Supermarket.API.Domain.Models;

namespace Supermarket.API.Persistence.Contexts
{
    public class AppDbContext : DbContext
    {
        public DbSet<Dataset> Datasets { get; set; }
        public DbSet<Distribution> Distributions { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            builder.Entity<Dataset>().ToTable("Datasets");
            builder.Entity<Dataset>().HasKey(p => p.Id);
            builder.Entity<Dataset>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();//.HasValueGenerator<InMemoryIntegerValueGenerator<int>>();
            builder.Entity<Dataset>().Property(p => p.Identifier).IsRequired();
            builder.Entity<Dataset>().Property(p => p.Title).IsRequired().HasMaxLength(60);
            builder.Entity<Dataset>().HasMany(p => p.Distributions).WithOne(p => p.Dataset).HasForeignKey(p => p.DatasetId);

            builder.Entity<Dataset>().HasData
            (
                new Dataset { Id = 100, Title = "Strand", Identifier = "/api/datasets/100", Description = "Strender i Trondheim"}, // Id set manually due to in-memory provider
                new Dataset { Id = 101, Title = "Strand", Identifier = "/api/datasets/101", Description = "Strender i Oslo" }
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
        }
    }
}