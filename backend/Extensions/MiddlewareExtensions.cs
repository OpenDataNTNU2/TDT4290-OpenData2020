﻿using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System;
using System.IO;
using System.Reflection;

namespace OpenData.API.Extensions
{
    public static class MiddlewareExtensions
    {
        public static IServiceCollection AddCustomSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(cfg =>
            {
                cfg.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "OpenData v2 API",
                    Version = "v2",
                    Description = "OpenData catalouge RESTful API built with ASP.NET Core 3.1.",
                    // Contact = new OpenApiContact
                    // {
                    //     Name = "Evandro Gayer Gomes",
                    //     Url = new Uri("https://evandroggomes.com.br/")
                    // },
                    // License = new OpenApiLicense
                    // {
                    //     Name = "MIT",
                    // },
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                cfg.IncludeXmlComments(xmlPath);
            });
            return services;
        }

        public static IApplicationBuilder UseCustomSwagger(this IApplicationBuilder app)
        {
            app.UseSwagger().UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "OpenData API");
                options.DocumentTitle = "OpenData API";
            });
            return app;
        }
    }
}
