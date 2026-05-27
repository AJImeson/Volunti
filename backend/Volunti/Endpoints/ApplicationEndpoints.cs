using System.Security.Claims;
using Volunti.DTOs.Job;
using Volunti.Interfaces;

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

            app.MapGet("/jobs/{id}/applications", async (int id, IApplicationService appService, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, data, error) = await appService.GetByJobAsync(id, userId);
                if (!success)
                    return error == "Forbidden" ? Results.Forbid() : Results.NotFound();

                return Results.Ok(data);
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));

            app.MapPost("/applications/bulk-approve", async (BulkApproveDto dto, IApplicationService appService, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, count, error) = await appService.BulkApproveAsync(dto.ApplicationIds, userId);
                if (!success)
                    return error == "Forbidden" ? Results.Forbid() : Results.BadRequest(error);

                return Results.Ok(new { approvedCount = count });
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));

            app.MapGet("/volunteers/{id}", async (int id, IVolunteerProfileService profileService, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, data, error) = await profileService.GetApplicantProfileAsync(id, userId);
                if (!success)
                    return error == "Forbidden" ? Results.Forbid() : Results.NotFound();

                return Results.Ok(data);
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));
        }
    }
}
