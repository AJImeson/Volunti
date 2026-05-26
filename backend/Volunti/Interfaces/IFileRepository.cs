using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IFileRepository
    {
        Task<Volunteer?> GetVolunteerByUserIdAsync(int userId);
        Task<List<VolunteerFile>> GetFilesByVolunteerIdAsync(int volunteerId, string? category = null);
        Task<VolunteerFile?> GetFileByIdAsync(int fileId, int volunteerId);
        Task<List<VolunteerFile>> GetCvFilesAsync(int volunteerId);
        Task<List<VolunteerFile>> GetAttachmentsByExperienceIdAsync(int volunteerId, int experienceId);
        Task AddFileAsync(VolunteerFile file);
        Task RemoveFileAsync(VolunteerFile file);
        Task RemoveFilesRangeAsync(IEnumerable<VolunteerFile> files);
        Task SaveChangesAsync();
    }
}
