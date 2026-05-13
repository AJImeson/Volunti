using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IOrganizationRepository
    {
        Task<List<Organization>> GetAllAsync();
        Task<Organization?> GetByIdAsync(int id);
        Task<Organization?> GetByUserIdAsync(int userId);
        Task<Organization?> GetWithJobsAsync(int id);
        Task AddMemberAsync(OrganizationMember member);
        Task RemoveAsync(Organization org);
        Task RemoveJobsRangeAsync(IEnumerable<Job> jobs);
        Task SaveChangesAsync();
    }
}
