using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IOrganizationRepository
    {
        Task<List<Organization>> GetAllAsync();
        Task<Organization?> GetByIdAsync(int id);
        Task<Organization?> GetByUserIdAsync(int userId);
        Task<Organization?> GetWithJobsAsync(int id);
        void AddMember(OrganizationMember member);
        void Remove(Organization org);
        void RemoveJobsRange(IEnumerable<Job> jobs);
        Task SaveChangesAsync();
    }
}
