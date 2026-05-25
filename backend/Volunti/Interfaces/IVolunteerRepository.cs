using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IVolunteerRepository
    {
        Task<Volunteer?> GetByUserIdAsync(int userId, bool includeSkills = false, bool includeInterests = false);
        Task<VolunteerSkill?> GetSkillByTitleAsync(string title);
        void AddSkill(VolunteerSkill skill);
        Task<VolunteerInterest?> GetInterestByTitleAsync(string title);
        void AddInterest(VolunteerInterest interest);
        Task<List<VolunteerExperience>> GetExperiencesByVolunteerIdAsync(int volunteerId);
        void AddExperience(VolunteerExperience experience);
        Task<VolunteerExperience?> GetExperienceByIdAsync(int experienceId, int volunteerId);
        void RemoveExperience(VolunteerExperience experience);
        Task<bool> PhoneNumberExistsAsync(string phoneNumber);
        void Add(Volunteer volunteer);
        Task SaveChangesAsync();
    }
}
