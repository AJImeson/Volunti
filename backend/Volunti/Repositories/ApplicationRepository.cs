using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Repositories
{
    public class ApplicationRepository(VoluntiDbContext db) : IApplicationRepository
    {
        public Task<List<VolunteerApplication>> GetByOrganizationAsync(int organizationId, ApplicationStatus? status)
        {
            var query = db.VolunteerApplications
                .Include(a => a.Job)
                .Include(a => a.Volunteer)
                .Where(a => a.Job.OrganizationId == organizationId);

            if (status.HasValue)
                query = query.Where(a => a.Status == status.Value);

            return query.ToListAsync();
        }

        public Task<List<VolunteerApplication>> GetByVolunteerAsync(int volunteerId) =>
            db.VolunteerApplications
                .Include(a => a.Job)
                    .ThenInclude(j => j.Organization)
                .Where(a => a.VolunteerId == volunteerId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

        public Task<VolunteerApplication?> GetByIdWithJobAsync(int id) =>
            db.VolunteerApplications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == id);

        public Task<bool> ExistsAsync(int volunteerId, int jobId) =>
            db.VolunteerApplications.AnyAsync(a => a.VolunteerId == volunteerId && a.JobId == jobId);

        public async Task AddAsync(VolunteerApplication application)
        {
            db.VolunteerApplications.Add(application);
        }

        public Task SaveChangesAsync() => db.SaveChangesAsync();
    }
}
