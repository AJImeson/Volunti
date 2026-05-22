using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.DTOs.Job;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public static class ApplicationEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapGet("/applications/mine", async (IApplicationService appService, HttpContext http, string? status) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, applications, error) = await appService.GetByOrganizationAsync(userId, status);
                if (!success) return Results.NotFound(error);

                return Results.Ok(applications!.Select(a => new
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

            app.MapPost("/jobs/{id}/apply", async (int id, IApplicationService appService, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, dto, error) = await appService.ApplyAsync(id, userId);
                if (!success)
                    return error == "conflict"
                        ? Results.Conflict(new { detail = "Du har redan ansökt till detta uppdrag." })
                        : Results.NotFound(error);

                return Results.Created($"/jobs/{id}/apply", dto);
            }).RequireAuthorization(policy => policy.RequireRole("Volunteer")).RequireRateLimiting("write");

            app.MapPut("/applications/{id}", async (int id, IApplicationService appService, HttpContext http, UpdateApplicationDto dto) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, result, error) = await appService.UpdateStatusAsync(id, userId, dto);
                if (!success)
                    return error == "NotFound" ? Results.NotFound() : Results.BadRequest(error);

                return Results.Ok(result);
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin"));

            app.MapGet("/applications/volunteer/mine", async (IApplicationService appService, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, applications, error) = await appService.GetByVolunteerAsync(userId);
                if (!success) return Results.NotFound(error);

                return Results.Ok(applications!.Select(a => new
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

            app.MapGet("/jobs/{id}/applications", async (
                int id,
                VoluntiDbContext db,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var job = await db.Jobs
                    .Include(j => j.Organization)
                    .FirstOrDefaultAsync(j => j.JobId == id);
                if (job == null) return Results.NotFound("Jobbet hittades inte.");

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

                var applications = await db.VolunteerApplications
                    .Where(a => a.JobId == id)
                    .Include(a => a.Volunteer)
                        .ThenInclude(v => v.User)
                    .ToListAsync();

                var volunteerIds = applications.Select(a => a.VolunteerId).ToList();
                var previousJobs = await db.VolunteerApplications
                    .Where(a =>
                        volunteerIds.Contains(a.VolunteerId) &&
                        a.JobId != id &&
                        a.Status == ApplicationStatus.Approved &&
                        a.Job.OrganizationId == organization.OrganizationId)
                    .Select(a => a.VolunteerId)
                    .ToListAsync();
                var previousSet = new HashSet<int>(previousJobs);

                return Results.Ok(applications.Select(a => new
                {
                    applicationId = a.Id,
                    status = a.Status.ToString(),
                    createdAt = a.CreatedAt,
                    volunteerId = a.VolunteerId,
                    volunteerUserId = a.Volunteer.UserId,
                    volunteerName = $"{a.Volunteer.FirstName} {a.Volunteer.LastName}".Trim(),
                    volunteerImageUrl = a.Volunteer.ProfileImageUrl,
                    isPreviousVolunteer = previousSet.Contains(a.VolunteerId)
                }));
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));

            app.MapPost("/applications/bulk-approve", async (
                BulkApproveDto dto,
                VoluntiDbContext db,
                HttpContext http) =>
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
                if (organization == null) return Results.Forbid();

                if (dto.ApplicationIds == null || dto.ApplicationIds.Count == 0)
                    return Results.BadRequest("Inga ansökningar valda.");

                var applications = await db.VolunteerApplications
                    .Include(a => a.Job)
                    .Include(a => a.Volunteer)
                    .Where(a =>
                        dto.ApplicationIds.Contains(a.Id) &&
                        a.Job.OrganizationId == organization.OrganizationId &&
                        a.Status == ApplicationStatus.Pending)
                    .ToListAsync();

                foreach (var app in applications)
                {
                    app.Status = ApplicationStatus.Approved;
                }
                await db.SaveChangesAsync();

                var orgGroupIds = await db.MessageGroups
                    .Where(g => g.OrganizationId == organization.OrganizationId)
                    .Select(g => g.Id)
                    .ToListAsync();

                if (orgGroupIds.Any())
                {
                    foreach (var app in applications)
                    {
                        var volunteerUserId = app.Volunteer.UserId;
                        var existing = await db.MessageGroupMembers
                            .Where(m => m.UserId == volunteerUserId && orgGroupIds.Contains(m.MessageGroupId))
                            .Select(m => m.MessageGroupId)
                            .ToListAsync();

                        foreach (var groupId in orgGroupIds.Except(existing))
                        {
                            db.MessageGroupMembers.Add(new MessageGroupMember
                            {
                                MessageGroupId = groupId,
                                UserId = volunteerUserId,
                                Role = GroupMemberRole.Member
                            });
                        }
                    }
                    await db.SaveChangesAsync();
                }

                return Results.Ok(new { approvedCount = applications.Count });
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));

            app.MapGet("/volunteers/{id}", async (
                int id,
                VoluntiDbContext db,
                HttpContext http) =>
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
                if (organization == null) return Results.Forbid();

                var volunteer = await db.Volunteers
                    .Include(v => v.User)
                    .Include(v => v.VolunteerSkills)
                    .Include(v => v.VolunteerInterests)
                    .FirstOrDefaultAsync(v => v.Id == id);

                if (volunteer == null) return Results.NotFound();

                var hasApplied = await db.VolunteerApplications
                    .AnyAsync(a => a.VolunteerId == id && a.Job.OrganizationId == organization.OrganizationId);

                if (!hasApplied) return Results.Forbid();

                var experiences = await db.VolunteerExperiences
                    .Where(e => e.VolunteerId == id)
                    .OrderByDescending(e => e.StartDate)
                    .ToListAsync();

                return Results.Ok(new
                {
                    id = volunteer.Id,
                    firstName = volunteer.FirstName,
                    lastName = volunteer.LastName,
                    bio = volunteer.Bio,
                    municipality = volunteer.Municipality,
                    driverLicense = volunteer.DriverLicense?.Split(",", StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>(),
                    availability = volunteer.Availability?.Split(",", StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>(),
                    profileImageUrl = volunteer.ProfileImageUrl,
                    email = volunteer.User?.Email,
                    phoneNumber = volunteer.PhoneNumber,
                    skills = volunteer.VolunteerSkills.Select(s => new { id = s.Id, title = s.Title }),
                    interests = volunteer.VolunteerInterests.Select(i => new { id = i.Id, title = i.Title }),
                    experiences = experiences.Select(e => new
                    {
                        id = e.Id,
                        title = e.Title,
                        organization = e.Organization,
                        startDate = e.StartDate,
                        endDate = e.EndDate,
                        description = e.Description,
                        hoursTotal = e.HoursTotal
                    })
                });
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));
        }
        public record BulkApproveDto(List<int> ApplicationIds);
    }
}
