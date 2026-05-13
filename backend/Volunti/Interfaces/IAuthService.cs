using Volunti.Dtos.User;

namespace Volunti.Interfaces
{
    public interface IAuthService
    {
        Task<(bool success, NewUserDto? user, string? error)> RegisterVolunteerAsync(RegisterVolunteerDto dto);
        Task<(bool success, NewUserDto? user, string? error)> RegisterOrganizationAsync(RegisterOrganizationDto dto);
        Task<(bool success, NewUserDto? user, string? error)> LoginAsync(LoginDto dto);
        Task<(bool emailTaken, bool phoneTaken)> CheckAvailabilityAsync(CheckAvailabilityDto dto);
        Task<(bool success, string? token, string? error)> ForgotPasswordAsync(ForgotPasswordDto dto);
        Task<(bool success, string? error)> ResetPasswordAsync(ResetPasswordDto dto);
        Task<object?> GetMeAsync(int userId);
    }
}
