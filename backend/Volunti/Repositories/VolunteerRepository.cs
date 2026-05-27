using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Repositories
{
    public class VolunteerRepository(VoluntiDbContext db) : IVolunteerRepository
    {
        public Task<Volunteer?> GetByUserIdAsync(int userId, bool includeSkills = false, bool includeInterests = false)
        {
            var query = db.Volunteers.AsQueryable();
            if (includeSkills) query = query.Include(v => v.VolunteerSkills);
            if (includeInterests) query = query.Include(v => v.VolunteerInterests);
            return query.FirstOrDefaultAsync(v => v.UserId == userId);
        }

        public Task<Volunteer?> GetByIdAsync(int volunteerId, bool includeSkills = false, bool includeInterests = false)
        {
            var query = db.Volunteers.Include(v => v.User).AsQueryable();
            if (includeSkills) query = query.Include(v => v.VolunteerSkills);
            if (includeInterests) query = query.Include(v => v.VolunteerInterests);
            return query.FirstOrDefaultAsync(v => v.Id == volunteerId);
        }

        public Task<VolunteerSkill?> GetSkillByTitleAsync(string title) =>
            db.VolunteerSkills.FirstOrDefaultAsync(s => s.Title.ToLower() == title.ToLower());

        public void AddSkill(VolunteerSkill skill) => db.VolunteerSkills.Add(skill);

        public Task<VolunteerInterest?> GetInterestByTitleAsync(string title) =>
            db.VolunteerInterests.FirstOrDefaultAsync(i => i.Title.ToLower() == title.ToLower());

        public void AddInterest(VolunteerInterest interest) => db.VolunteerInterests.Add(interest);

        public Task<List<VolunteerExperience>> GetExperiencesByVolunteerIdAsync(int volunteerId) =>
            db.VolunteerExperiences
                .Where(e => e.VolunteerId == volunteerId)
                .OrderByDescending(e => e.StartDate)
                .ToListAsync();

        public void AddExperience(VolunteerExperience experience) => db.VolunteerExperiences.Add(experience);

        public Task<VolunteerExperience?> GetExperienceByIdAsync(int experienceId, int volunteerId) =>
            db.VolunteerExperiences.FirstOrDefaultAsync(e => e.Id == experienceId && e.VolunteerId == volunteerId);

        public void RemoveExperience(VolunteerExperience experience) => db.VolunteerExperiences.Remove(experience);

        public Task<bool> PhoneNumberExistsAsync(string phoneNumber) =>
            db.Volunteers.AnyAsync(v => v.PhoneNumber == phoneNumber);

        public void Add(Volunteer volunteer) => db.Volunteers.Add(volunteer);

        public Task SaveChangesAsync() =>
            db.SaveChangesAsync();
    }
}
