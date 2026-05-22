using Volunti.DTOs.Job;
using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IApplicationService
    {
        Task<(bool success, List<VolunteerApplication>? data, string? error)> GetByOrganizationAsync(int userId, string? status);
        Task<(bool success, ApplicationDto? dto, string? error)> ApplyAsync(int jobId, int userId);
        Task<(bool success, ApplicationDto? dto, string? error)> UpdateStatusAsync(int applicationId, int userId, UpdateApplicationDto dto);
        Task<(bool success, List<VolunteerApplication>? data, string? error)> GetByVolunteerAsync(int userId);
    }
}
