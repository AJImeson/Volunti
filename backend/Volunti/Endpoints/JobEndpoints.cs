using System.Security.Claims;
using Volunti.DTOs;
using Volunti.Interfaces;
using Volunti.Mappers;

namespace Volunti.Endpoints
{
    public class JobEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapGet("/jobs/mine", async (IJobService jobService, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();
                var (success, jobs, error) = await jobService.GetByUserAsync(userId);
                if (!success) return Results.NotFound(error);
                return Results.Ok(jobs!.Select(j => j.ToJobDto()));
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));

            app.MapGet("/jobs", async (IJobService jobService) =>
            {
                var jobs = await jobService.GetAllAsync();
                return Results.Ok(jobs.Select(j => j.ToJobDto()));
            });

            app.MapGet("/jobs/{id}", async (int id, IJobService jobService) =>
            {
                var job = await jobService.GetByIdAsync(id);
                return job is null ? Results.NotFound() : Results.Ok(job.ToJobDto());
            });

            app.MapPost("/jobs", async (CreateJobDto dto, IJobService jobService, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var isAdmin = http.User.IsInRole("Admin");
                var (success, job, error) = await jobService.CreateAsync(dto, userId, isAdmin);

                if (!success) return Results.BadRequest(error);
                return Results.Created($"/jobs/{job!.JobId}", job.ToJobDto());
            }).RequireAuthorization();

            app.MapDelete("/jobs/{id}", async (int id, IJobService jobService, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var isAdmin = http.User.IsInRole("Admin");
                var (success, error) = await jobService.DeleteAsync(id, userId, isAdmin);

                if (!success) return Results.BadRequest(error);
                return Results.Ok();
            }).RequireAuthorization();
        }
    }
}
