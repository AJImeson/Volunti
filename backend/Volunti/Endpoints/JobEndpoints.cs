using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Mappers;
using Volunti.Models;
using Volunti.DTOs;
using System.Security.Claims;

namespace Volunti.Endpoints
{
    public class JobEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapGet("/jobs/mine", async (VoluntiDbContext db, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
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
                var jobs = await db.Jobs
                    .Include(j => j.Organization)
                    .Where(j => j.OrganizationId == organization.OrganizationId)
                    .ToListAsync();
                return Results.Ok(jobs.Select(j => j.ToJobDto()));
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));

            // Returnerar alla jobb
            app.MapGet("/jobs", async (VoluntiDbContext db) =>
            {
                var jobs = await db.Jobs
                    .Include(j => j.Organization)
                    .ToListAsync();
                return Results.Ok(jobs.Select(j => j.ToJobDto()));
            });

            app.MapGet("/jobs/{id}", async (int id, VoluntiDbContext db) =>
            {
                var job = await db.Jobs
                    .Include(j => j.Organization)
                    .FirstOrDefaultAsync(j => j.JobId == id);
                return job is null ? Results.NotFound() : Results.Ok(job.ToJobDto());
            });

            app.MapPost("/jobs", async (CreateJobDto dto, VoluntiDbContext db, HttpContext http) =>
            {
                if (dto.StartTime >= dto.EndTime)
                    return Results.BadRequest("Endtime måste vara efter StartTime.");
                var userIdClaim = http.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Results.Unauthorized();
                if (!int.TryParse(userIdClaim, out var userId)) return Results.Unauthorized();
                var isAdmin = http.User.IsInRole("Admin");
                Organization? organization;
                if (isAdmin)
                {
                    if (dto.OrganizationId == null)
                        return Results.BadRequest("OrganisationId krävs för Admin.");
                    organization = await db.Organizations.FirstOrDefaultAsync(o => o.OrganizationId == dto.OrganizationId);
                    if (organization == null) return Results.BadRequest("Ogiltigt OrganisationId.");
                }
                else
                {
                    // Hitta org via Organizations.UserId 
                    organization = await db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                    if (organization == null)
                    {
                        var membership = await db.OrganizationMembers
                            .Include(m => m.Organization)
                            .FirstOrDefaultAsync(m => m.UserId == userId);
                        organization = membership?.Organization;
                    }
                    if (organization == null) return Results.BadRequest("Användaren har ingen organisation");
                }
                var job = new Job
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    Category = dto.Category,
                    StartTime = dto.StartTime,
                    EndTime = dto.EndTime,
                    Address = dto.Address,
                    City = dto.City,
                    IsUrgent = dto.IsUrgent,
                    OrganizationId = organization.OrganizationId,
                    CreatedOn = DateTime.UtcNow,
                    Status = JobStatus.Open
                };
                db.Jobs.Add(job);
                await db.SaveChangesAsync();
                return Results.Created($"/jobs/{job.JobId}", job.ToJobDto());
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));

            // PUT /jobs/{id} - uppdatera ett jobb (bara orgens ägare/medlem)
            app.MapPut("/jobs/{id}", async (
                int id,
                CreateJobDto dto,
                VoluntiDbContext db,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var job = await db.Jobs.FindAsync(id);
                if (job == null) return Results.NotFound("Jobbet hittades inte.");

                // Verifiera att användaren tillhör orgen som äger jobbet
                var organization = await db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                if (organization == null)
                {
                    var membership = await db.OrganizationMembers
                        .Include(m => m.Organization)
                        .FirstOrDefaultAsync(m => m.UserId == userId);
                    organization = membership?.Organization;
                }
                if (organization == null || job.OrganizationId != organization.OrganizationId)
                    return Results.Forbid();

                // Validering
                if (string.IsNullOrWhiteSpace(dto.Title))
                    return Results.BadRequest("Titel krävs.");
                if (string.IsNullOrWhiteSpace(dto.City))
                    return Results.BadRequest("Stad krävs.");
                if (dto.EndTime <= dto.StartTime)
                    return Results.BadRequest("Sluttid måste vara efter starttid.");

                // Uppdatera fält
                job.Title = dto.Title.Trim();
                job.Description = dto.Description?.Trim() ?? string.Empty;
                job.Category = dto.Category;
                job.StartTime = dto.StartTime;
                job.EndTime = dto.EndTime;
                job.Address = dto.Address?.Trim() ?? string.Empty;
                job.City = dto.City.Trim();
                job.IsUrgent = dto.IsUrgent;

                await db.SaveChangesAsync();
                return Results.Ok(new { jobId = job.JobId });
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"))
            .RequireRateLimiting("write");

            app.MapDelete("/jobs/{id}", async (int id, VoluntiDbContext db, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Results.Unauthorized();
                if (!int.TryParse(userIdClaim, out var userId)) return Results.Unauthorized();
                var isAdmin = http.User.IsInRole("Admin");
                var organization = await db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);
                var job = await db.Jobs.FindAsync(id);
                if (job == null) return Results.NotFound("Jobbet hittades inte.");
                if (!isAdmin && (organization == null || job.OrganizationId != organization.OrganizationId))
                    return Results.BadRequest("Du har inte behörighet att ta bort detta jobb.");
                db.Jobs.Remove(job);
                await db.SaveChangesAsync();
                return Results.Ok($"Jobb: '{job.Title}' med id: '{job.JobId}' togs bort.");
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin"));
        }
    }
}