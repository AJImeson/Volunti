using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Volunti.Data;
using Volunti.Dtos.User;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class AuthEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapPost("/register", async (RegisterDto registerDto, UserManager<AppUser> userManager, ITokenService tokenService) =>
            {
                try
                {
                    var allowedRoles = new[] { "Volunteer", "Organization" };
                    if (!allowedRoles.Contains(registerDto.Role))
                        return Results.BadRequest("Invalid role");

                    var appUser = new AppUser
                    {
                        UserName = registerDto.Email,
                        Email = registerDto.Email
                    };

                    var createdUser = await userManager.CreateAsync(appUser, registerDto.Password!);
                    if (!createdUser.Succeeded)
                    {
                        Console.WriteLine(string.Join(", ", createdUser.Errors.Select(e => e.Description)));
                        return Results.BadRequest("Registration failed");
                    }

                    var roleResult = await userManager.AddToRoleAsync(appUser, registerDto.Role!);
                    if (!roleResult.Succeeded)
                        return Results.Problem(string.Join(", ", roleResult.Errors.Select(e => e.Description)), statusCode: 500);

                    return Results.Ok(new NewUserDto
                    {
                        UserName = appUser.UserName!,
                        Email = appUser.Email!,
                        Token = tokenService.CreateToken(appUser)
                    });
                }
                catch (Exception e)
                {
                    return Results.Problem(e.Message, statusCode: 500);
                }
            });

            app.MapPost("/login", async (LoginDto loginDto, SignInManager<AppUser> signInManager, UserManager<AppUser> userManager, ITokenService tokenService) =>
            {
                var user = await userManager.Users.FirstOrDefaultAsync(u => u.UserName == loginDto.Username.ToLower());
                if (user == null) return Results.Unauthorized();

                var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
                if (!result.Succeeded) return Results.Unauthorized();

                return Results.Ok(new NewUserDto
                {
                    UserName = user.UserName!,
                    Email = user.Email!,
                    Token = tokenService.CreateToken(user)
                });
            });

            app.MapPost("/auth/forgot-password", async (ForgotPasswordDto dto, UserManager<AppUser> userManager, VoluntiDbContext db) =>
            {
                var user = await userManager.FindByEmailAsync(dto.Email);
                if (user == null) return Results.Ok(); // Avslöja inte om e-posten finns

                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                var tokenHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

                db.PasswordResetTokens.Add(new PasswordResetToken
                {
                    UserId = user.Id,
                    TokenHash = tokenHash,
                    ExpiresAt = DateTime.UtcNow.AddHours(1)
                });
                await db.SaveChangesAsync();

                // I produktion: skicka token via e-post. Returnerar token direkt för nu.
                return Results.Ok(new { token });
            });

            app.MapPost("/auth/reset-password", async (ResetPasswordDto dto, UserManager<AppUser> userManager, VoluntiDbContext db) =>
            {
                var user = await userManager.FindByEmailAsync(dto.Email);
                if (user == null) return Results.BadRequest("Invalid request");

                var tokenHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(dto.Token)));
                var storedToken = await db.PasswordResetTokens
                    .FirstOrDefaultAsync(t => t.UserId == user.Id && t.TokenHash == tokenHash && t.UsedAt == null && t.ExpiresAt > DateTime.UtcNow);

                if (storedToken == null) return Results.BadRequest("Invalid or expired token");

                var result = await userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
                if (!result.Succeeded)
                    return Results.BadRequest(result.Errors.Select(e => e.Description));

                storedToken.UsedAt = DateTime.UtcNow;
                await db.SaveChangesAsync();

                return Results.Ok("Password reset successful");
            });
        }
    }
}
