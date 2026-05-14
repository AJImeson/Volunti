using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Volunti.Data;
using Volunti.DTOs;
using Volunti.DTOs.Job;
using Volunti.Mappers;
using Volunti.Migrations;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public static class ApplicationEndpoints
    {
        
        public static void RegisterEndpoints(WebApplication app) 
        {
            // Endpoint för voluntärer att söka uppdrag
            app.MapPost("/jobs/{id}/apply", async (int id, VoluntiDbContext db, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userIdClaim == null)
                    return Results.Unauthorized();

                if (!int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);

                if (volunteer == null)
                    return Results.NotFound("Volontären hittades inte.");

                var job = await db.Jobs.FindAsync(id);

                if (job == null)
                    return Results.NotFound("Jobbet hittades inte.");

                var application = new VolunteerApplication
                {
                    VolunteerId = volunteer.Id,
                    JobId = job.JobId,
                    Status = ApplicationStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                db.VolunteerApplications.Add(application);
                await db.SaveChangesAsync();

                return Results.Created($"/jobs/{job.JobId}/apply", new ApplicationDto
                {
                    ApplicationId = application.Id,
                    Status = application.Status,
                    CreatedAt = application.CreatedAt,
                    VolunteerId = application.VolunteerId,
                    JobId = application.JobId
                });


            }).RequireAuthorization(policy => policy.RequireRole("Volunteer")); // Bara voluntärer kan ansöka om jobb

            // Endpoint för OrgAdmin att approve/reject application 
            app.MapPut("/applications/{id}", async (int id, VoluntiDbContext db, HttpContext http, UpdateApplicationDto dto) =>
            {
                var application = await db.VolunteerApplications.Include(a => a.Job).FirstOrDefaultAsync(a => a.Id == id);

                if (application == null)
                    return Results.NotFound("Ansökan hittades inte.");

                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userIdClaim == null)
                    return Results.Unauthorized();

                if (!int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();
                
               var organization = await db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId); // Leta upp organisationen, ansökan måste vara kopplad till en organisation som matchar med Orgadmin

                if (organization == null)
                    return Results.NotFound("Organizationen hittades inte.");

                //Jämför application.Job.OrganizationId med organization.OrganizationId för att verifiera ägarskap
                if (application.Job.OrganizationId != organization.OrganizationId)
                    return Results.BadRequest("Du har inte behörighet att hantera denna ansökan.");

                // Gå vidare enbart om Application Status är Pending
                if (application.Status != ApplicationStatus.Pending)
                {
                    return Results.BadRequest("Ansökan är redan behandlad.");
                }

                
                // OrgAdmin får bara sätta status till Approved eller Rejected
                if (dto.Status != ApplicationStatus.Approved && dto.Status != ApplicationStatus.Rejected)
                    return Results.BadRequest("Status måste vara Approved eller Rejected.");

                application.Status = dto.Status;
                await db.SaveChangesAsync();

                // Returnera den uppdaterade ansökan till frontend så de ser den nya statusen
                return Results.Ok(new ApplicationDto
                {
                    ApplicationId = application.Id,
                    Status = application.Status,
                    CreatedAt = application.CreatedAt,
                    VolunteerId = application.VolunteerId,
                    JobId = application.JobId
                });

            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin"));
        }
    }
}
