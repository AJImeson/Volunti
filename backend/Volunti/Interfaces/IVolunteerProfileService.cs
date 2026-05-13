using Volunti.DTOs;

namespace Volunti.Interfaces
{
    public interface IVolunteerProfileService
    {
        Task<(bool found, IEnumerable<object>? skills)> GetSkillsAsync(int userId);
        Task<(bool success, object? skill, string? error)> AddSkillAsync(string title, int userId);
        Task<(bool success, string? error)> RemoveSkillAsync(int skillId, int userId);
        Task<(bool found, IEnumerable<object>? interests)> GetInterestsAsync(int userId);
        Task<(bool success, object? interest, string? error)> AddInterestAsync(string title, int userId);
        Task<(bool success, string? error)> RemoveInterestAsync(int interestId, int userId);
        Task<(bool found, object? experiences)> GetExperiencesAsync(int userId);
        Task<(bool success, object? experience, string? error)> AddExperienceAsync(AddExperienceDto dto, int userId);
        Task<(bool success, string? error)> RemoveExperienceAsync(int experienceId, int userId, string contentRootPath);
    }
}
