using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IApplicationRepository
    {
        Task<List<VolunteerApplication>> GetByOrganizationAsync(int organizationId, ApplicationStatus? status);
        Task<List<VolunteerApplication>> GetByVolunteerAsync(int volunteerId);
        Task<VolunteerApplication?> GetByIdWithJobAsync(int id);
        Task<bool> ExistsAsync(int volunteerId, int jobId);
        Task<List<VolunteerApplication>> GetByJobAsync(int jobId);
        Task<List<VolunteerApplication>> GetByIdsForOrgAsync(List<int> ids, int organizationId);
        Task<List<int>> GetApprovedVolunteerIdsByOrgAsync(List<int> volunteerIds, int jobId, int organizationId);
        Task<bool> HasVolunteerAppliedToOrgAsync(int volunteerId, int organizationId);
        void Add(VolunteerApplication application);
        Task SaveChangesAsync();
    }
}
