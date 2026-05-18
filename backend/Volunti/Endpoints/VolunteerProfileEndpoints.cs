using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Volunti.Data;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class VolunteerProfileEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            // hämta inloggad volontär
            static async Task<Volunteer?> GetVolunteerAsync(
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db,
                bool includeSkills = false,
                bool includeInterests = false)
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return null;

                var query = db.Volunteers.AsQueryable();
                if (includeSkills) query = query.Include(v => v.VolunteerSkills);
                if (includeInterests) query = query.Include(v => v.VolunteerInterests);

                return await query.FirstOrDefaultAsync(v => v.UserId == userId);
            }

            /* ==========================================================================
               SKILLS
               ========================================================================== */

            app.MapGet("/me/skills", async (
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var volunteer = await GetVolunteerAsync(claims, userManager, db, includeSkills: true);
                if (volunteer is null) return Results.NotFound();

                return Results.Ok(volunteer.VolunteerSkills.Select(s => new
                {
                    id = s.Id,
                    title = s.Title,
                    description = s.Description
                }));
            }).RequireAuthorization();

            app.MapPost("/me/skills", async (
                AddTitleDto dto,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                if (string.IsNullOrWhiteSpace(dto.Title))
                    return Results.BadRequest("Title krävs.");

                var volunteer = await GetVolunteerAsync(claims, userManager, db, includeSkills: true);
                if (volunteer is null) return Results.NotFound();

                var normalizedTitle = dto.Title.Trim();

                var existing = await db.VolunteerSkills
                    .FirstOrDefaultAsync(s => s.Title.ToLower() == normalizedTitle.ToLower());

                if (existing is null)
                {
                    existing = new VolunteerSkill
                    {
                        Title = normalizedTitle,
                        Description = string.Empty
                    };
                    db.VolunteerSkills.Add(existing);
                    await db.SaveChangesAsync();
                }

                if (!volunteer.VolunteerSkills.Any(s => s.Id == existing.Id))
                {
                    volunteer.VolunteerSkills.Add(existing);
                    await db.SaveChangesAsync();
                }

                return Results.Ok(new
                {
                    id = existing.Id,
                    title = existing.Title,
                    description = existing.Description
                });
            }).RequireAuthorization();

            app.MapDelete("/me/skills/{skillId}", async (
                int skillId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var volunteer = await GetVolunteerAsync(claims, userManager, db, includeSkills: true);
                if (volunteer is null) return Results.NotFound();

                var skill = volunteer.VolunteerSkills.FirstOrDefault(s => s.Id == skillId);
                if (skill is null) return Results.NotFound();

                volunteer.VolunteerSkills.Remove(skill);
                await db.SaveChangesAsync();
                return Results.Ok();
            }).RequireAuthorization();

            /* ==========================================================================
               INTERESTS
               ========================================================================== */

            app.MapGet("/me/interests", async (
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var volunteer = await GetVolunteerAsync(claims, userManager, db, includeInterests: true);
                if (volunteer is null) return Results.NotFound();

                return Results.Ok(volunteer.VolunteerInterests.Select(i => new
                {
                    id = i.Id,
                    title = i.Title,
                    description = i.Description
                }));
            }).RequireAuthorization();

            app.MapPost("/me/interests", async (
                AddTitleDto dto,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                if (string.IsNullOrWhiteSpace(dto.Title))
                    return Results.BadRequest("Title krävs.");

                var volunteer = await GetVolunteerAsync(claims, userManager, db, includeInterests: true);
                if (volunteer is null) return Results.NotFound();

                var normalizedTitle = dto.Title.Trim();

                var existing = await db.VolunteerInterests
                    .FirstOrDefaultAsync(i => i.Title.ToLower() == normalizedTitle.ToLower());

                if (existing is null)
                {
                    existing = new VolunteerInterest
                    {
                        Title = normalizedTitle,
                        Description = "Tillagt av användare" 
                    };
                    db.VolunteerInterests.Add(existing);
                    await db.SaveChangesAsync();
                }

                if (!volunteer.VolunteerInterests.Any(i => i.Id == existing.Id))
                {
                    volunteer.VolunteerInterests.Add(existing);
                    await db.SaveChangesAsync();
                }

                return Results.Ok(new
                {
                    id = existing.Id,
                    title = existing.Title,
                    description = existing.Description
                });
            }).RequireAuthorization();

            app.MapDelete("/me/interests/{interestId}", async (
                int interestId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var volunteer = await GetVolunteerAsync(claims, userManager, db, includeInterests: true);
                if (volunteer is null) return Results.NotFound();

                var interest = volunteer.VolunteerInterests.FirstOrDefault(i => i.Id == interestId);
                if (interest is null) return Results.NotFound();

                volunteer.VolunteerInterests.Remove(interest);
                await db.SaveChangesAsync();
                return Results.Ok();
            }).RequireAuthorization();


            /* ==========================================================================
               EXPERIENCES
               ========================================================================== */

            app.MapGet("/me/experiences", async (
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer is null) return Results.NotFound();

                var experiences = await db.VolunteerExperiences
                    .Where(e => e.VolunteerId == volunteer.Id)
                    .OrderByDescending(e => e.StartDate)
                    .ToListAsync();

                var attachments = await db.VolunteerFiles
                    .Where(f => f.VolunteerId == volunteer.Id && f.Category == "experience-attachment")
                    .ToListAsync();

                var result = experiences.Select(e => new
                {
                    id = e.Id,
                    title = e.Title,
                    organization = e.Organization,
                    startDate = e.StartDate,
                    endDate = e.EndDate,
                    description = e.Description,
                    hoursTotal = e.HoursTotal,
                    attachment = attachments
                        .Where(a => a.ExperienceId == e.Id)
                        .Select(a => new
                        {
                            id = a.Id,
                            originalFileName = a.OriginalFileName,
                            title = a.Title,
                            fileSizeBytes = a.FileSizeBytes
                        })
                        .FirstOrDefault()
                });

                return Results.Ok(result);
            }).RequireAuthorization();

            app.MapPost("/me/experiences", async (
                AddExperienceDto dto,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                if (string.IsNullOrWhiteSpace(dto.Title))
                    return Results.BadRequest(new { detail = "Titel krävs." });

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer is null) return Results.NotFound();

                var experience = new VolunteerExperience
                {
                    VolunteerId = volunteer.Id,
                    Title = dto.Title.Trim(),
                    Organization = dto.Organization?.Trim() ?? string.Empty,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    Description = dto.Description?.Trim() ?? string.Empty,
                    HoursTotal = dto.HoursTotal
                };

                db.VolunteerExperiences.Add(experience);
                await db.SaveChangesAsync();

                return Results.Ok(new
                {
                    id = experience.Id,
                    title = experience.Title,
                    organization = experience.Organization,
                    startDate = experience.StartDate,
                    endDate = experience.EndDate,
                    description = experience.Description,
                    hoursTotal = experience.HoursTotal,
                    attachment = (object?)null
                });
            }).RequireAuthorization();

            app.MapDelete("/me/experiences/{experienceId}", async (
                int experienceId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer is null) return Results.NotFound();

                var experience = await db.VolunteerExperiences
                    .FirstOrDefaultAsync(e => e.Id == experienceId && e.VolunteerId == volunteer.Id);

                if (experience is null) return Results.NotFound();

                var attachments = await db.VolunteerFiles
                    .Where(f => f.ExperienceId == experienceId && f.VolunteerId == volunteer.Id)
                    .ToListAsync();

                foreach (var att in attachments)
                {
                    var path = Path.Combine(env.ContentRootPath, "uploads", volunteer.Id.ToString(), att.StoredFileName);
                    if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
                    db.VolunteerFiles.Remove(att);
                }

                db.VolunteerExperiences.Remove(experience);
                await db.SaveChangesAsync();
                return Results.Ok();
            }).RequireAuthorization();
        }

        public record AddTitleDto(string Title);

        public record AddExperienceDto(
            string Title,
            string? Organization,
            DateTime? StartDate,
            DateTime? EndDate,
            string? Description,
            int? HoursTotal
        );
    }
}