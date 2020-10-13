using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenData.API.Controllers.Config;
using OpenData.API.Domain.Repositories;
using OpenData.API.Domain.Services;
using OpenData.API.Extensions;
using OpenData.API.Persistence.Contexts;
using OpenData.API.Persistence.Repositories;
using OpenData.API.Services;

namespace OpenData.API
{
    public class Startup
    {

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                                builder =>
                                {
                                    builder.WithOrigins("http://localhost:3000")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod();
                                });
            });

            services.AddMemoryCache();

            services.AddCustomSwagger();

            services.AddControllers().ConfigureApiBehaviorOptions(options =>
            {
                // Adds a custom error response factory when ModelState is invalid
                options.InvalidModelStateResponseFactory = InvalidModelStateResponseFactory.ProduceErrorResponse;
            });

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase(Configuration.GetConnectionString("memory"));
            });

            services.AddScoped<IDatasetRepository, DatasetRepository>();
            services.AddScoped<IDistributionRepository, DistributionRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPublisherRepository, PublisherRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ITagsRepository, TagsRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ICoordinationRepository, CoordinationRepository>();

            services.AddScoped<IDatasetService, DatasetService>();
            services.AddScoped<IDistributionService, DistributionService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPublisherService, PublisherService>();
            services.AddScoped<ITagsService, TagsService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ICoordinationService, CoordinationService>();

            services.AddScoped<IGraphService, GraphService>();
            services.AddScoped<IRdfService, RdfService>();


            services.AddAutoMapper(typeof(Startup));

            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors();

            app.UseCustomSwagger();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}