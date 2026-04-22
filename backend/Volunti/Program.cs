
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Volunti.Data;
using Volunti.Endpoints;

namespace Volunti
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddAuthorization();

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddDbContext<VoluntiDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            JobEnpoints.RegisterEndpoints(app);
            MessageEndpoints.RegisterEndpoints(app);
            NotificationsEndpoints.RegisterEndpoints(app);
            OrganizationEndpoints.RegisterEndpoints(app);
            RoleEndpoints.RegisterEndpoints(app);
            UserEndpoints.RegisterEndpoints(app);
            VolunteerApplicationEndpoints.RegisterEndpoints(app);
            VolunteerEndpoints.RegisterEndpoints(app);
            VolunteerInterestEndpoints.RegisterEndpoints(app);
            VolunteerSkillEndpoints.RegisterEndpoints(app);

            app.Run();
        }
    }
}