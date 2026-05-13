using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Volunti.Data;
using Volunti.Dtos.User;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Service
{
    public class AuthService(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ITokenService tokenService,
        IVolunteerRepository volunteerRepo,
        VoluntiDbContext db,
        ILogger<AuthService> logger) : IAuthService
    {
        public async Task<(bool success, NewUserDto? user, string? error)> RegisterVolunteerAsync(RegisterVolunteerDto dto)
        {
            try
            {
                var existingEmail = await userManager.FindByEmailAsync(dto.Email!);
                if (existingEmail != null)
                    return (false, null, "Det finns redan ett konto med den här mejladressen.");

                if (await volunteerRepo.PhoneNumberExistsAsync(dto.PhoneNumber!))
                    return (false, null, "Det finns redan ett konto med det här telefonnumret.");

                var appUser = new AppUser { UserName = dto.Email, Email = dto.Email };
                var createdUser = await userManager.CreateAsync(appUser, dto.Password!);
                if (!createdUser.Succeeded)
                    return (false, null, string.Join(", ", createdUser.Errors.Select(e => e.Description)));

                var roleResult = await userManager.AddToRoleAsync(appUser, "Volunteer");
                if (!roleResult.Succeeded)
                    return (false, null, string.Join(", ", roleResult.Errors.Select(e => e.Description)));

                var interests = new List<VolunteerInterest>();
                if (dto.Interests != null && dto.Interests.Any())
                {
                    foreach (var interestName in dto.Interests)
                    {
                        var existing = await volunteerRepo.GetInterestByTitleAsync(interestName);
                        if (existing != null)
                        {
                            interests.Add(existing);
                        }
                        else
                        {
                            var newInterest = new VolunteerInterest { Title = interestName, Description = interestName };
                            await volunteerRepo.AddInterestAsync(newInterest);
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
                    Municipality = dto.Municipality!,
                    DriverLicense = dto.DriverLicense!,
                    Availability = dto.Availability!,
                    MaxDistanceKm = dto.MaxDistanceKm!,
                    NotificationPreference = dto.NotificationPreference!,
                    EmailNotifications = dto.EmailNotifications,
                    IsVerified = false,
                    VolunteerInterests = interests
                };

                await volunteerRepo.AddAsync(volunteer);
                await volunteerRepo.SaveChangesAsync();

                var roles = await userManager.GetRolesAsync(appUser);
                return (true, new NewUserDto
                {
                    UserName = appUser.UserName!,
                    Email = appUser.Email!,
                    Token = tokenService.CreateToken(appUser, roles)
                }, null);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Registration failed for {Email}", dto.Email);
                return (false, null, "Registration failed. Please try again.");
            }
        }

        public async Task<(bool success, NewUserDto? user, string? error)> RegisterOrganizationAsync(RegisterOrganizationDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Email))
                    return (false, null, "Email krävs.");

                var appUser = new AppUser { UserName = dto.Email.ToLower(), Email = dto.Email.ToLower() };
                var createdUser = await userManager.CreateAsync(appUser, dto.Password!);
                if (!createdUser.Succeeded)
                    return (false, null, string.Join(", ", createdUser.Errors.Select(e => e.Description)));

                var roleResult = await userManager.AddToRoleAsync(appUser, "OrgAdmin");
                if (!roleResult.Succeeded)
                    return (false, null, string.Join(", ", roleResult.Errors.Select(e => e.Description)));

                db.Organizations.Add(new Organization
                {
                    UserId = appUser.Id,
                    CompanyName = dto.CompanyName!,
                    OrgName = dto.OrgName!,
                    ContactName = dto.ContactName!,
                    OrgNumber = dto.OrgNumber ?? string.Empty,
                    Description = dto.Description ?? string.Empty,
                    Municipality = dto.Municipality!,
                    ProfileImageUrl = dto.ProfileImageUrl ?? string.Empty,
                    Website = dto.Website ?? string.Empty,
                    RequiresDocumentation = dto.RequiresDocumentation,
                    NotificationPreference = dto.NotificationPreference ?? "Rekommenderat",
                    EmailNotifications = dto.EmailNotifications,
                    Categories = dto.Categories != null ? string.Join(",", dto.Categories) : string.Empty
                });
                await db.SaveChangesAsync();

                var roles = await userManager.GetRolesAsync(appUser);
                return (true, new NewUserDto
                {
                    UserName = appUser.UserName!,
                    Email = appUser.Email!,
                    Token = tokenService.CreateToken(appUser, roles)
                }, null);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Organization registration failed for {Email}", dto.Email);
                return (false, null, "Registration failed. Please try again.");
            }
        }

        public async Task<(bool success, NewUserDto? user, string? error)> LoginAsync(LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return (false, null, "Username and password are required.");

            var user = await userManager.Users.FirstOrDefaultAsync(u => u.UserName == dto.Username.ToLower());
            if (user == null)
                return (false, null, null);

            var result = await signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded)
                return (false, null, null);

            var roles = await userManager.GetRolesAsync(user);
            return (true, new NewUserDto
            {
                UserName = user.UserName!,
                Email = user.Email!,
                Token = tokenService.CreateToken(user, roles)
            }, null);
        }

        public async Task<(bool emailTaken, bool phoneTaken)> CheckAvailabilityAsync(CheckAvailabilityDto dto)
        {
            var emailTaken = false;
            var phoneTaken = false;

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var existingEmail = await userManager.FindByEmailAsync(dto.Email);
                emailTaken = existingEmail != null;
            }

            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
                phoneTaken = await volunteerRepo.PhoneNumberExistsAsync(dto.PhoneNumber);

            return (emailTaken, phoneTaken);
        }

        public async Task<(bool success, string? token, string? error)> ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return (true, null, null);

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var tokenHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

            db.PasswordResetTokens.Add(new PasswordResetToken
            {
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddHours(1)
            });
            await db.SaveChangesAsync();

            // TODO: PRODUKTION - Skicka token via e-post
            return (true, token, null);
        }

        public async Task<(bool success, string? error)> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return (false, "Invalid request");

            var tokenHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(dto.Token)));
            var storedToken = await db.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.UserId == user.Id && t.TokenHash == tokenHash && t.UsedAt == null && t.ExpiresAt > DateTime.UtcNow);

            if (storedToken == null)
                return (false, "Invalid or expired token");

            var result = await userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            storedToken.UsedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return (true, null);
        }

        public async Task<object?> GetMeAsync(int userId)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user is null) return null;

            var volunteer = await volunteerRepo.GetByUserIdAsync(userId);
            if (volunteer is null) return null;

            return new
            {
                email = user.Email,
                userName = user.UserName,
                firstName = volunteer.FirstName,
                lastName = volunteer.LastName,
                phoneNumber = volunteer.PhoneNumber,
                municipality = volunteer.Municipality,
                driverLicense = volunteer.DriverLicense,
                availability = volunteer.Availability,
                maxDistanceKm = volunteer.MaxDistanceKm,
                bio = volunteer.Bio,
                dateOfBirth = volunteer.DateOfBirth,
                profileImageUrl = volunteer.ProfileImageUrl,
                notificationPreference = volunteer.NotificationPreference,
                emailNotifications = volunteer.EmailNotifications,
                isVerified = volunteer.IsVerified
            };
        }
    }
}
