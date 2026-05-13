using Volunti.DTOs;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Service
{
    public class VolunteerProfileService(
        IVolunteerRepository volunteerRepo,
        IFileRepository fileRepo) : IVolunteerProfileService
    {
        public async Task<(bool found, IEnumerable<object>? skills)> GetSkillsAsync(int userId)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId, includeSkills: true);
            if (volunteer is null) return (false, null);

            return (true, volunteer.VolunteerSkills.Select(s => (object)new
            {
                id = s.Id,
                title = s.Title,
                description = s.Description
            }));
        }

        public async Task<(bool success, object? skill, string? error)> AddSkillAsync(string title, int userId)
        {
            if (string.IsNullOrWhiteSpace(title))
                return (false, null, "Title krävs.");

            var volunteer = await volunteerRepo.GetByUserIdAsync(userId, includeSkills: true);
            if (volunteer is null) return (false, null, "NotFound");

            var normalizedTitle = title.Trim();
            var existing = await volunteerRepo.GetSkillByTitleAsync(normalizedTitle);

            if (existing is null)
            {
                existing = new VolunteerSkill { Title = normalizedTitle, Description = string.Empty };
                await volunteerRepo.AddSkillAsync(existing);
                await volunteerRepo.SaveChangesAsync();
            }

            if (!volunteer.VolunteerSkills.Any(s => s.Id == existing.Id))
            {
                volunteer.VolunteerSkills.Add(existing);
                await volunteerRepo.SaveChangesAsync();
            }

            return (true, new { id = existing.Id, title = existing.Title, description = existing.Description }, null);
        }

        public async Task<(bool success, string? error)> RemoveSkillAsync(int skillId, int userId)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId, includeSkills: true);
            if (volunteer is null) return (false, "NotFound");

            var skill = volunteer.VolunteerSkills.FirstOrDefault(s => s.Id == skillId);
            if (skill is null) return (false, "NotFound");

            volunteer.VolunteerSkills.Remove(skill);
            await volunteerRepo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool found, IEnumerable<object>? interests)> GetInterestsAsync(int userId)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId, includeInterests: true);
            if (volunteer is null) return (false, null);

            return (true, volunteer.VolunteerInterests.Select(i => (object)new
            {
                id = i.Id,
                title = i.Title,
                description = i.Description
            }));
        }

        public async Task<(bool success, object? interest, string? error)> AddInterestAsync(string title, int userId)
        {
            if (string.IsNullOrWhiteSpace(title))
                return (false, null, "Title krävs.");

            var volunteer = await volunteerRepo.GetByUserIdAsync(userId, includeInterests: true);
            if (volunteer is null) return (false, null, "NotFound");

            var normalizedTitle = title.Trim();
            var existing = await volunteerRepo.GetInterestByTitleAsync(normalizedTitle);

            if (existing is null)
            {
                existing = new VolunteerInterest { Title = normalizedTitle, Description = "Tillagt av användare" };
                await volunteerRepo.AddInterestAsync(existing);
                await volunteerRepo.SaveChangesAsync();
            }

            if (!volunteer.VolunteerInterests.Any(i => i.Id == existing.Id))
            {
                volunteer.VolunteerInterests.Add(existing);
                await volunteerRepo.SaveChangesAsync();
            }

            return (true, new { id = existing.Id, title = existing.Title, description = existing.Description }, null);
        }

        public async Task<(bool success, string? error)> RemoveInterestAsync(int interestId, int userId)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId, includeInterests: true);
            if (volunteer is null) return (false, "NotFound");

            var interest = volunteer.VolunteerInterests.FirstOrDefault(i => i.Id == interestId);
            if (interest is null) return (false, "NotFound");

            volunteer.VolunteerInterests.Remove(interest);
            await volunteerRepo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool found, object? experiences)> GetExperiencesAsync(int userId)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId);
            if (volunteer is null) return (false, null);

            var experiences = await volunteerRepo.GetExperiencesByVolunteerIdAsync(volunteer.Id);
            var attachments = await fileRepo.GetFilesByVolunteerIdAsync(volunteer.Id, "experience-attachment");

            var result = experiences.Select(e => (object)new
            {
                id = e.Id,
                title = e.Title,
                organization = e.Organization,
                startDate = e.StartDate,
                endDate = e.EndDate,
                description = e.Description,
                hoursTotal = e.HoursTotal,
                attachment = attachments
                    .Where(a => a.ExperienceId == e.Id)
                    .Select(a => new
                    {
                        id = a.Id,
                        originalFileName = a.OriginalFileName,
                        title = a.Title,
                        fileSizeBytes = a.FileSizeBytes
                    })
                    .FirstOrDefault()
            });

            return (true, result);
        }

        public async Task<(bool success, object? experience, string? error)> AddExperienceAsync(AddExperienceDto dto, int userId)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return (false, null, "Titel krävs.");

            var volunteer = await volunteerRepo.GetByUserIdAsync(userId);
            if (volunteer is null) return (false, null, "NotFound");

            var experience = new VolunteerExperience
            {
                VolunteerId = volunteer.Id,
                Title = dto.Title.Trim(),
                Organization = dto.Organization?.Trim() ?? string.Empty,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Description = dto.Description?.Trim() ?? string.Empty,
                HoursTotal = dto.HoursTotal
            };

            await volunteerRepo.AddExperienceAsync(experience);
            await volunteerRepo.SaveChangesAsync();

            return (true, new
            {
                id = experience.Id,
                title = experience.Title,
                organization = experience.Organization,
                startDate = experience.StartDate,
                endDate = experience.EndDate,
                description = experience.Description,
                hoursTotal = experience.HoursTotal,
                attachment = (object?)null
            }, null);
        }

        public async Task<(bool success, string? error)> RemoveExperienceAsync(int experienceId, int userId, string contentRootPath)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId);
            if (volunteer is null) return (false, "NotFound");

            var experience = await volunteerRepo.GetExperienceByIdAsync(experienceId, volunteer.Id);
            if (experience is null) return (false, "NotFound");

            var attachments = await fileRepo.GetAttachmentsByExperienceIdAsync(volunteer.Id, experienceId);
            foreach (var att in attachments)
            {
                var path = Path.Combine(contentRootPath, "uploads", volunteer.Id.ToString(), att.StoredFileName);
                if (File.Exists(path)) File.Delete(path);
                await fileRepo.RemoveFileAsync(att);
            }

            await volunteerRepo.RemoveExperienceAsync(experience);
            await volunteerRepo.SaveChangesAsync();
            return (true, null);
        }
    }
}
