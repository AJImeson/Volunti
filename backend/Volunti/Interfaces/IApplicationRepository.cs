using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IApplicationRepository
    {
        Task<List<VolunteerApplication>> GetByOrganizationAsync(int organizationId, ApplicationStatus? status);
        Task<List<VolunteerApplication>> GetByVolunteerAsync(int volunteerId);
        Task<VolunteerApplication?> GetByIdWithJobAsync(int id);
        Task<bool> ExistsAsync(int volunteerId, int jobId);
        Task AddAsync(VolunteerApplication application);
        Task SaveChangesAsync();
    }
}
