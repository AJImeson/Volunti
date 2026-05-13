using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Volunti.DTOs;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class VolunteerProfileEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            /* ==========================================================================
               SKILLS
               ========================================================================== */

            app.MapGet("/me/skills", async (
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IVolunteerProfileService profileService) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (found, skills) = await profileService.GetSkillsAsync(userId);
                return found ? Results.Ok(skills) : Results.NotFound();
            }).RequireAuthorization();

            app.MapPost("/me/skills", async (
                AddTitleDto dto,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IVolunteerProfileService profileService) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, skill, error) = await profileService.AddSkillAsync(dto.Title, userId);
                if (!success) return error == "NotFound" ? Results.NotFound() : Results.BadRequest(error);
                return Results.Ok(skill);
            }).RequireAuthorization();

            app.MapDelete("/me/skills/{skillId}", async (
                int skillId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IVolunteerProfileService profileService) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, error) = await profileService.RemoveSkillAsync(skillId, userId);
                if (!success) return Results.NotFound();
                return Results.Ok();
            }).RequireAuthorization();

            /* ==========================================================================
               INTERESTS
               ========================================================================== */

            app.MapGet("/me/interests", async (
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IVolunteerProfileService profileService) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (found, interests) = await profileService.GetInterestsAsync(userId);
                return found ? Results.Ok(interests) : Results.NotFound();
            }).RequireAuthorization();

            app.MapPost("/me/interests", async (
                AddTitleDto dto,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IVolunteerProfileService profileService) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, interest, error) = await profileService.AddInterestAsync(dto.Title, userId);
                if (!success) return error == "NotFound" ? Results.NotFound() : Results.BadRequest(error);
                return Results.Ok(interest);
            }).RequireAuthorization();

            app.MapDelete("/me/interests/{interestId}", async (
                int interestId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IVolunteerProfileService profileService) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, error) = await profileService.RemoveInterestAsync(interestId, userId);
                if (!success) return Results.NotFound();
                return Results.Ok();
            }).RequireAuthorization();

            /* ==========================================================================
               EXPERIENCES
               ========================================================================== */

            app.MapGet("/me/experiences", async (
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IVolunteerProfileService profileService) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (found, experiences) = await profileService.GetExperiencesAsync(userId);
                return found ? Results.Ok(experiences) : Results.NotFound();
            }).RequireAuthorization();

            app.MapPost("/me/experiences", async (
                AddExperienceDto dto,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IVolunteerProfileService profileService) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, experience, error) = await profileService.AddExperienceAsync(dto, userId);
                if (!success) return error == "NotFound" ? Results.NotFound() : Results.BadRequest(new { detail = error });
                return Results.Ok(experience);
            }).RequireAuthorization();

            app.MapDelete("/me/experiences/{experienceId}", async (
                int experienceId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IVolunteerProfileService profileService,
                IWebHostEnvironment env) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, error) = await profileService.RemoveExperienceAsync(experienceId, userId, env.ContentRootPath);
                if (!success) return Results.NotFound();
                return Results.Ok();
            }).RequireAuthorization();
        }
    }
}
