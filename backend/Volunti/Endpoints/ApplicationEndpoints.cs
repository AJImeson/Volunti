using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Volunti.Data;
using Volunti.DTOs.Job;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public static class ApplicationEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            // GET /applications/mine lista alla ansökningar för inloggad orgs jobb
            app.MapGet("/applications/mine", async (VoluntiDbContext db, HttpContext http, string? status) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();
                var organization = await db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                if (organization == null)
                {
                    var membership = await db.OrganizationMembers
                        .Include(m => m.Organization)
                        .FirstOrDefaultAsync(m => m.UserId == userId);
                    organization = membership?.Organization;
                }
                if (organization == null)
                    return Results.NotFound("Användaren har ingen organisation.");
                var query = db.VolunteerApplications
                    .Include(a => a.Job)
                    .Include(a => a.Volunteer)
                    .Where(a => a.Job.OrganizationId == organization.OrganizationId);
                if (!string.IsNullOrEmpty(status) && Enum.TryParse<ApplicationStatus>(status, true, out var parsedStatus))
                    query = query.Where(a => a.Status == parsedStatus);
                var applications = await query.ToListAsync();
                return Results.Ok(applications.Select(a => new
                {
                    applicationId = a.Id,
                    status = a.Status.ToString(),
                    createdAt = a.CreatedAt,
                    volunteerId = a.VolunteerId,
                    jobId = a.JobId,
                    jobTitle = a.Job.Title,
                    volunteerName = a.Volunteer != null ? $"{a.Volunteer.FirstName} {a.Volunteer.LastName}" : "Okänd"
                }));
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));

            // Endpoint för voluntärer att söka uppdrag
            app.MapPost("/jobs/{id}/apply", async (int id, VoluntiDbContext db, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Results.Unauthorized();
                if (!int.TryParse(userIdClaim, out var userId)) return Results.Unauthorized();
                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer == null) return Results.NotFound("Volontären hittades inte.");

                var job = await db.Jobs.FindAsync(id);
                if (job == null) return Results.NotFound("Jobbet hittades inte.");

                // Kolla om volontären redan ansökt till detta jobb
                var existing = await db.VolunteerApplications
                    .FirstOrDefaultAsync(a => a.VolunteerId == volunteer.Id && a.JobId == job.JobId);

                if (existing != null)
                    return Results.Conflict(new { detail = "Du har redan ansökt till detta uppdrag." });

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
            }).RequireAuthorization(policy => policy.RequireRole("Volunteer")).RequireRateLimiting("write");

            // Endpoint för OrgAdmin att approve/reject application
            app.MapPut("/applications/{id}", async (int id, VoluntiDbContext db, HttpContext http, UpdateApplicationDto dto) =>
            {
                var application = await db.VolunteerApplications.Include(a => a.Job).FirstOrDefaultAsync(a => a.Id == id);
                if (application == null) return Results.NotFound("Ansökan hittades inte.");
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Results.Unauthorized();
                if (!int.TryParse(userIdClaim, out var userId)) return Results.Unauthorized();
                var organization = await db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                if (organization == null) return Results.NotFound("Organizationen hittades inte.");
                if (application.Job.OrganizationId != organization.OrganizationId)
                    return Results.BadRequest("Du har inte behörighet att hantera denna ansökan.");
                if (application.Status != ApplicationStatus.Pending)
                    return Results.BadRequest("Ansökan är redan behandlad.");
                if (dto.Status != ApplicationStatus.Approved && dto.Status != ApplicationStatus.Rejected)
                    return Results.BadRequest("Status måste vara Approved eller Rejected.");
                application.Status = dto.Status;
                await db.SaveChangesAsync();
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



            app.MapGet("/applications/volunteer/mine", async (
                VoluntiDbContext db,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer == null)
                    return Results.NotFound("Volontären hittades inte.");

                var applications = await db.VolunteerApplications
                    .Include(a => a.Job)
                        .ThenInclude(j => j.Organization)
                    .Where(a => a.VolunteerId == volunteer.Id)
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync();

                return Results.Ok(applications.Select(a => new
                {
                    applicationId = a.Id,
                    status = a.Status.ToString(),
                    createdAt = a.CreatedAt,
                    jobId = a.JobId,
                    jobTitle = a.Job.Title,
                    jobDescription = a.Job.Description,
                    jobStartTime = a.Job.StartTime,
                    jobEndTime = a.Job.EndTime,
                    jobCity = a.Job.City,
                    jobAddress = a.Job.Address,
                    organizationName = a.Job.Organization != null
                        ? (a.Job.Organization.OrgName ?? a.Job.Organization.CompanyName ?? "Okänd")
                        : "Okänd"
                }));
            })
            .RequireAuthorization(policy => policy.RequireRole("Volunteer"));
                    }
    }
}