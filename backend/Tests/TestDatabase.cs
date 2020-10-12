using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using OpenData.API.Domain.Models;
using OpenData.API.Persistence.Contexts;
using OpenData.API.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;

namespace Tests
{
    /**
     * This class provides a simple test database with mock data. See DatasetServiceTest for a usage example.
     */
    public class TestDatabase
    {
        protected SqliteConnection Connection { get; }
        public DbContextOptions<AppDbContext> ContextOptions { get; }

        public TestDatabase()
        {
            Connection = new SqliteConnection("DataSource=:memory:");
            Connection.Open();
            ContextOptions = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(Connection).Options;

            EnsureCleanDatabase();
        }

        ~TestDatabase()
        {
            Console.WriteLine("Closing database connection.");
            Connection.Close();
        }

        public void EnsureCleanDatabase()
        {
            using var context = new AppDbContext(ContextOptions);
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
        }

        public void AddTestData()
        {
            using var context = new AppDbContext(ContextOptions);
            context.AddTestData();
        }
    }
}
