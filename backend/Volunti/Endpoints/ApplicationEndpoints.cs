using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Mappers;
using Volunti.Models;
using Volunti.DTOs;
using System.Security.Claims;
using Volunti.DTOs.Job;

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
        }
    }
}
