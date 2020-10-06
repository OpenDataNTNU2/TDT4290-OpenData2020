using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenData.API.Persistence.Contexts;

using System;
using System.Collections.Generic;
using VDS.RDF;
using VDS.RDF.Writing;
using VDS.RDF.Parsing;

namespace OpenData.API
{

#pragma warning disable CS1591
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            using (var context = scope.ServiceProvider.GetService<AppDbContext>())
            {
                context.Database.EnsureCreated();
            }
            
            RdfFileHandler rdfFileHandler = new RdfFileHandler();
            rdfFileHandler.example();

            host.Run();
        }


        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
#pragma warning restore CS1591
}