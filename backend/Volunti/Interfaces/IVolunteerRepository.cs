using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IVolunteerRepository
    {
        Task<Volunteer?> GetByUserIdAsync(int userId, bool includeSkills = false, bool includeInterests = false);
        Task<VolunteerSkill?> GetSkillByTitleAsync(string title);
        Task AddSkillAsync(VolunteerSkill skill);
        Task<VolunteerInterest?> GetInterestByTitleAsync(string title);
        Task AddInterestAsync(VolunteerInterest interest);
        Task<List<VolunteerExperience>> GetExperiencesByVolunteerIdAsync(int volunteerId);
        Task AddExperienceAsync(VolunteerExperience experience);
        Task<VolunteerExperience?> GetExperienceByIdAsync(int experienceId, int volunteerId);
        Task RemoveExperienceAsync(VolunteerExperience experience);
        Task<bool> PhoneNumberExistsAsync(string phoneNumber);
        Task AddAsync(Volunteer volunteer);
        Task SaveChangesAsync();
    }
}
