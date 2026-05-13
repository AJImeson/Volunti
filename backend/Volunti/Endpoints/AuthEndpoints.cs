using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Volunti.Dtos.User;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class AuthEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapPost("/register/volunteer", async (
                RegisterVolunteerDto dto,
                IAuthService authService) =>
            {
                var (success, user, error) = await authService.RegisterVolunteerAsync(dto);
                if (!success)
                    return error?.Contains("finns redan") == true
                        ? Results.Conflict(new { detail = error })
                        : Results.Problem(error, statusCode: 500);
                return Results.Ok(user);
            });

            app.MapPost("/register/check-availability", async (
                CheckAvailabilityDto dto,
                IAuthService authService) =>
            {
                var (emailTaken, phoneTaken) = await authService.CheckAvailabilityAsync(dto);
                return Results.Ok(new { emailTaken, phoneTaken });
            });

            app.MapPost("/register/organization", async (
                RegisterOrganizationDto dto,
                IAuthService authService) =>
            {
                var (success, user, error) = await authService.RegisterOrganizationAsync(dto);
                if (!success)
                    return error == "Email krävs."
                        ? Results.BadRequest(new { detail = error })
                        : Results.Problem(error, statusCode: 500);
                return Results.Ok(user);
            });

            app.MapPost("/login", async (LoginDto loginDto, IAuthService authService) =>
            {
                var (success, user, error) = await authService.LoginAsync(loginDto);
                if (!success)
                    return error != null ? Results.BadRequest(error) : Results.Unauthorized();
                return Results.Ok(user);
            });

            app.MapPost("/auth/forgot-password", async (ForgotPasswordDto dto, IAuthService authService) =>
            {
                var (_, token, _) = await authService.ForgotPasswordAsync(dto);
                // TODO: PRODUKTION - Returnera bara Results.Ok() och skicka token via e-post
                return token != null ? Results.Ok(new { token }) : Results.Ok();
            });

            app.MapPost("/auth/reset-password", async (ResetPasswordDto dto, IAuthService authService) =>
            {
                var (success, error) = await authService.ResetPasswordAsync(dto);
                if (!success) return Results.BadRequest(error);
                return Results.Ok("Password reset successful");
            }).RequireRateLimiting("auth");

            app.MapGet("/me", async (
                ClaimsPrincipal claimsPrincipal,
                UserManager<AppUser> userManager,
                IAuthService authService) =>
            {
                var userIdStr = userManager.GetUserId(claimsPrincipal);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var result = await authService.GetMeAsync(userId);
                return result is null ? Results.NotFound() : Results.Ok(result);
            }).RequireAuthorization();

            
        }
    }
}
