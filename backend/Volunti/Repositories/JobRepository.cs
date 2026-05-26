using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Repositories
{
    public class JobRepository(VoluntiDbContext db) : IJobRepository
    {
        public Task<List<Job>> GetAllAsync() =>
            db.Jobs.ToListAsync();

        public Task<List<Job>> GetByOrganizationIdAsync(int organizationId) =>
            db.Jobs.Include(j => j.Organization).Where(j => j.OrganizationId == organizationId).ToListAsync();

        public Task<Job?> GetByIdAsync(int id) =>
            db.Jobs.FindAsync(id).AsTask();

        public void Add(Job job) => db.Jobs.Add(job);

        public void Remove(Job job) => db.Jobs.Remove(job);

        public Task SaveChangesAsync() =>
            db.SaveChangesAsync();
    }
}
