using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Volunti.Data;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class ScheduleEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            // GET /me/availability - hämta alla tillgängliga datum för inloggad volontär
            app.MapGet("/me/availability", async (
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer is null) return Results.NotFound("Volontären hittades inte.");

                var dates = await db.VolunteerAvailabilities
                    .Where(va => va.VolunteerId == volunteer.Id)
                    .OrderBy(va => va.Date)
                    .Select(va => va.Date)
                    .ToListAsync();

                return Results.Ok(dates);
            }).RequireAuthorization(policy => policy.RequireRole("Volunteer"));

            // PUT /me/availability ersätt hela tillgänglighetslistan
            app.MapPut("/me/availability", async (
                UpdateAvailabilityDto dto,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer is null) return Results.NotFound("Volontären hittades inte.");

                // Ta bort befintliga
                var existing = await db.VolunteerAvailabilities
                    .Where(va => va.VolunteerId == volunteer.Id)
                    .ToListAsync();
                db.VolunteerAvailabilities.RemoveRange(existing);

                // Filtrera bort förflutna och dubbletter
                var today = DateTime.UtcNow.Date;
                var distinctDates = (dto.Dates ?? new List<DateTime>())
                    .Select(d => DateTime.SpecifyKind(d.Date, DateTimeKind.Utc))
                    .Where(d => d >= today)
                    .Distinct()
                    .ToList();

                foreach (var date in distinctDates)
                {
                    db.VolunteerAvailabilities.Add(new VolunteerAvailability
                    {
                        VolunteerId = volunteer.Id,
                        Date = date
                    });
                }

                await db.SaveChangesAsync();
                return Results.Ok(distinctDates);
            }).RequireAuthorization(policy => policy.RequireRole("Volunteer"));
        }

        public record UpdateAvailabilityDto(List<DateTime> Dates);
    }
}