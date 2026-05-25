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

        public Task<List<VolunteerApplication>> GetByJobAsync(int jobId) =>
            db.VolunteerApplications
                .Where(a => a.JobId == jobId)
                .Include(a => a.Volunteer).ThenInclude(v => v.User)
                .ToListAsync();

        public Task<List<VolunteerApplication>> GetByIdsForOrgAsync(List<int> ids, int organizationId) =>
            db.VolunteerApplications
                .Include(a => a.Job)
                .Include(a => a.Volunteer)
                .Where(a => ids.Contains(a.Id) && a.Job.OrganizationId == organizationId && a.Status == ApplicationStatus.Pending)
                .ToListAsync();

        public Task<List<int>> GetApprovedVolunteerIdsByOrgAsync(List<int> volunteerIds, int jobId, int organizationId) =>
            db.VolunteerApplications
                .Where(a =>
                    volunteerIds.Contains(a.VolunteerId) &&
                    a.JobId != jobId &&
                    a.Status == ApplicationStatus.Approved &&
                    a.Job.OrganizationId == organizationId)
                .Select(a => a.VolunteerId)
                .ToListAsync();

        public Task<bool> HasVolunteerAppliedToOrgAsync(int volunteerId, int organizationId) =>
            db.VolunteerApplications.AnyAsync(a => a.VolunteerId == volunteerId && a.Job.OrganizationId == organizationId);

        public void Add(VolunteerApplication application) =>
            db.VolunteerApplications.Add(application);

        public Task SaveChangesAsync() => db.SaveChangesAsync();
    }
}
