using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IJobRepository
    {
        Task<List<Job>> GetAllAsync();
        Task<List<Job>> GetByOrganizationIdAsync(int organizationId);
        Task<Job?> GetByIdAsync(int id);
        Task AddAsync(Job job);
        Task RemoveAsync(Job job);
        Task SaveChangesAsync();
    }
}
