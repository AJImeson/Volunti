using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IJobRepository
    {
        Task<List<Job>> GetAllAsync();
        Task<List<Job>> GetByOrganizationIdAsync(int organizationId);
        Task<Job?> GetByIdAsync(int id);
        void Add(Job job);
        void Remove(Job job);
        Task SaveChangesAsync();
    }
}
