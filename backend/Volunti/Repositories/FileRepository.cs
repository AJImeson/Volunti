using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Repositories
{
    public class FileRepository(VoluntiDbContext db) : IFileRepository
    {
        public Task<Volunteer?> GetVolunteerByUserIdAsync(int userId) =>
            db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);

        public Task<Organization?> GetOrganizationByUserIdAsync(int userId) =>
            db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);

        public Task<List<VolunteerFile>> GetFilesByVolunteerIdAsync(int volunteerId, string? category = null)
        {
            var query = db.VolunteerFiles.Where(f => f.VolunteerId == volunteerId);
            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(f => f.Category == category.ToLower());
            return query.OrderByDescending(f => f.UploadedAt).ToListAsync();
        }

        public Task<VolunteerFile?> GetFileByIdAsync(int fileId, int volunteerId) =>
            db.VolunteerFiles.FirstOrDefaultAsync(f => f.Id == fileId && f.VolunteerId == volunteerId);

        public Task<List<VolunteerFile>> GetCvFilesAsync(int volunteerId) =>
            db.VolunteerFiles.Where(f => f.VolunteerId == volunteerId && f.Category == "cv").ToListAsync();

        public Task<List<VolunteerFile>> GetAttachmentsByExperienceIdAsync(int volunteerId, int experienceId) =>
            db.VolunteerFiles
                .Where(f => f.ExperienceId == experienceId && f.VolunteerId == volunteerId)
                .ToListAsync();

        public async Task AddFileAsync(VolunteerFile file)
        {
            db.VolunteerFiles.Add(file);
        }

        public async Task RemoveFileAsync(VolunteerFile file)
        {
            db.VolunteerFiles.Remove(file);
        }

        public async Task RemoveFilesRangeAsync(IEnumerable<VolunteerFile> files)
        {
            db.VolunteerFiles.RemoveRange(files);
        }

        public Task SaveChangesAsync() =>
            db.SaveChangesAsync();
    }
}
