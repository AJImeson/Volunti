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

                // När en volontär godkänns. Lägg till dom i alla orgs grupper automatiskt
                if (dto.Status == ApplicationStatus.Approved)
                {
                    var volunteer = await db.Volunteers.FindAsync(application.VolunteerId);
                    if (volunteer != null)
                    {
                        // Hitta alla grupper för denna org
                        var orgGroups = await db.MessageGroups
                            .Where(g => g.OrganizationId == organization.OrganizationId)
                            .Select(g => g.Id)
                            .ToListAsync();

                        // Hitta vilka grupper användaren redan är med i
                        var existingMemberships = await db.MessageGroupMembers
                            .Where(m => m.UserId == volunteer.UserId && orgGroups.Contains(m.MessageGroupId))
                            .Select(m => m.MessageGroupId)
                            .ToListAsync();

                        // Lägg till i grupper som dom ännu inte är med i
                        foreach (var groupId in orgGroups.Except(existingMemberships))
                        {
                            db.MessageGroupMembers.Add(new MessageGroupMember
                            {
                                MessageGroupId = groupId,
                                UserId = volunteer.UserId,
                                Role = GroupMemberRole.Member
                            });
                        }
                        await db.SaveChangesAsync();
                    }
                }
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

            // alla ansökningar för ett specifikt jobb
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

                // Kolla att användaren tillhör orgen
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

                // Räkna ut tidigare volontär (om volontär har gjort jobb för denna org tidigare)
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

            // godkänn flera samtidigt
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

                // Auto tillägg till orgens grupper
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

            // hämta full profil för en volontär 
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

                // Verifiera att volontären har sökt något av orgens jobb
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