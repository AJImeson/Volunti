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
            app.MapPost("/register/volunteer", async (
     RegisterVolunteerDto dto,
     UserManager<AppUser> userManager,
     ITokenService tokenService,
     VoluntiDbContext db) =>
            {
                try
                {
                    var appUser = new AppUser { UserName = dto.Email.ToLower(), Email = dto.Email.ToLower() };

                    var createdUser = await userManager.CreateAsync(appUser, dto.Password!);
                    if (!createdUser.Succeeded)
                        return Results.BadRequest(createdUser.Errors.Select(e => e.Description));

                    var roleResult = await userManager.AddToRoleAsync(appUser, "Volunteer");
                    if (!roleResult.Succeeded)
                        return Results.Problem(string.Join(", ", roleResult.Errors.Select(e => e.Description)), statusCode: 500);

                   
                    var interests = new List<VolunteerInterest>();
                    if (dto.Interests != null && dto.Interests.Any())
                    {
                        foreach (var interestName in dto.Interests)
                        {
                            var existing = await db.VolunteerInterests
                                .FirstOrDefaultAsync(i => i.Title == interestName);

                            if (existing != null)
                            {
                                interests.Add(existing);
                            }
                            else
                            {
                                var newInterest = new VolunteerInterest
                                {
                                    Title = interestName,
                                    Description = interestName 
                                };
                                db.VolunteerInterests.Add(newInterest);
                                interests.Add(newInterest);
                            }
                        }
                    }

                    var volunteer = new Volunteer
                    {
                        UserId = appUser.Id,
                        FirstName = dto.FirstName!,
                        LastName = dto.LastName!,
                        DateOfBirth = dto.DateOfBirth ?? default,
                        Bio = dto.Bio ?? string.Empty,
                        ProfileImageUrl = dto.ProfileImageUrl ?? string.Empty,
                        PhoneNumber = dto.PhoneNumber!,
                        Muncipilaity = dto.Muncipilaity!,
                        DriverLicense = dto.DriverLicense!,
                        Availability = dto.Availability!,
                        MaxDistanceKm = dto.MaxDistanceKm,
                        NotificationPreference = dto.NotificationPreference!,
                        EmailNotifications = dto.EmailNotifications,
                        IsVerified = false,
                        VolunteerInterests = interests
                    };

                    db.Volunteers.Add(volunteer);
                    await db.SaveChangesAsync();

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

            app.MapPost("/register/organization", async (
                RegisterOrganizationDto dto,
                UserManager<AppUser> userManager,
                ITokenService tokenService,
                VoluntiDbContext db) =>
            {
                try
                {
                    var appUser = new AppUser { UserName = dto.Email.ToLower(), Email = dto.Email.ToLower() };

                    var createdUser = await userManager.CreateAsync(appUser, dto.Password!);
                    if (!createdUser.Succeeded)
                        return Results.BadRequest(createdUser.Errors.Select(e => e.Description));

                    var roleResult = await userManager.AddToRoleAsync(appUser, "OrgAdmin");
                    if (!roleResult.Succeeded)
                        return Results.Problem(string.Join(", ", roleResult.Errors.Select(e => e.Description)), statusCode: 500);

                    db.Organizations.Add(new Organization
                    {
                        UserId = appUser.Id,
                        CompanyName = dto.CompanyName!,
                        OrgName = dto.OrgName!,
                        ContactName = dto.ContactName!,
                        OrgNumber = dto.OrgNumber ?? string.Empty,
                        Description = dto.Description ?? string.Empty,
                        Muncipilaity = dto.Muncipilaity!,
                        ProfileImageUrl = dto.ProfileImageUrl ?? string.Empty,
                        Website = dto.Website ?? string.Empty,
                        RequiresDocumentation = dto.RequiresDocumentation,
                        NotificationPreference = dto.NotificationPreference ?? "Rekommenderat",
                        EmailNotifications = dto.EmailNotifications,
                        Categories = dto.Categories != null ? string.Join(",", dto.Categories) : string.Empty
                    });
                    await db.SaveChangesAsync();

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
                if (string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
                    return Results.BadRequest("Username and password are required.");
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

                // TODO: PRODUKTION - Skicka token via e-post istället för att returnera den i response
                // HUR: 1) Lägg till en e-posttjänst (SendGrid, Mailgun, SMTP, etc.) i DI-containern
                //      2) Bygg en reset-länk: $"https://volunti.se/reset-password?token={token}&email={user.Email}"
                //      3) Skicka länken till user.Email
                //      4) Ändra raden nedan till bara: return Results.Ok();
                //
                // VARFÖR: Tokenen är "biljetten" som låter någon återställa lösenordet utan att vara inloggad.
                //         Att returnera den i response = vem som helst som vet en e-postadress kan ta över kontot.
                //         I produktion ska tokenen ENDAST hamna i ägarens inkorg - det är så vi vet att det är
                //         rätt person (eftersom bara de kan läsa sin egen e-post).
                return Results.Ok(new { token }); // OBS: Endast för dev - tokenen returneras så man kan testa reset-flödet manuellt
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
