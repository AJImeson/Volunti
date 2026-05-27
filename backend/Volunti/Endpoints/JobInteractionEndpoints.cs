using System.Security.Claims;
using Volunti.DTOs.Job;
using Volunti.Interfaces;

namespace Volunti.Endpoints
{
    public class JobInteractionEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapPost("/jobs/{id}/like", async (
                int id,
                IJobInteractionService interactionService,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, data, error) = await interactionService.ToggleLikeAsync(id, userId);
                if (!success) return Results.NotFound(error);
                return Results.Ok(data);
            })
            .RequireAuthorization();

            app.MapGet("/jobs/{id}/likes", async (
                int id,
                IJobInteractionService interactionService,
                HttpContext http) =>
            {
                int? userId = null;
                var claim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (claim != null && int.TryParse(claim, out var uid))
                    userId = uid;

                var data = await interactionService.GetLikesAsync(id, userId);
                return Results.Ok(data);
            });

            app.MapGet("/jobs/{id}/comments", async (
                int id,
                IJobInteractionService interactionService,
                HttpContext http) =>
            {
                int? userId = null;
                var claim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (claim != null && int.TryParse(claim, out var uid))
                    userId = uid;

                var (success, data, error) = await interactionService.GetCommentsAsync(id, userId);
                if (!success) return Results.NotFound();
                return Results.Ok(data);
            });

            app.MapPost("/jobs/{id}/comments", async (
                int id,
                CreateCommentDto dto,
                IJobInteractionService interactionService,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, data, error) = await interactionService.AddCommentAsync(id, userId, dto);
                if (!success) return Results.BadRequest(error);
                return Results.Ok(data);
            })
            .RequireAuthorization()
            .RequireRateLimiting("write");

            app.MapDelete("/jobs/{jobId}/comments/{commentId}", async (
                int jobId,
                int commentId,
                IJobInteractionService interactionService,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, error) = await interactionService.DeleteCommentAsync(jobId, commentId, userId);
                if (!success)
                    return error == "NotFound" ? Results.NotFound() : Results.Forbid();

                return Results.Ok();
            })
            .RequireAuthorization();

            app.MapPost("/comments/{id}/like", async (
                int id,
                IJobInteractionService interactionService,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var (success, data, error) = await interactionService.ToggleCommentLikeAsync(id, userId);
                if (!success) return Results.NotFound(error);
                return Results.Ok(data);
            })
            .RequireAuthorization();
        }
    }
}
