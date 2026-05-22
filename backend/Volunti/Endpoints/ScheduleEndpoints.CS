using System.Security.Claims;
using Volunti.Interfaces;

namespace Volunti.Endpoints
{
    public class ScheduleEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapGet("/me/availability", async (
                ClaimsPrincipal claims,
                IScheduleService scheduleService) =>
            {
                var userIdStr = claims.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, dates, error) = await scheduleService.GetAvailabilityAsync(userId);
                if (!success) return Results.NotFound(error);
                return Results.Ok(dates);
            }).RequireAuthorization(policy => policy.RequireRole("Volunteer"));

            app.MapPut("/me/availability", async (
                UpdateAvailabilityDto dto,
                ClaimsPrincipal claims,
                IScheduleService scheduleService) =>
            {
                var userIdStr = claims.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, dates, error) = await scheduleService.UpdateAvailabilityAsync(userId, dto.Dates ?? new List<DateTime>());
                if (!success) return Results.NotFound(error);
                return Results.Ok(dates);
            }).RequireAuthorization(policy => policy.RequireRole("Volunteer"));
        }

        public record UpdateAvailabilityDto(List<DateTime> Dates);
    }
}
