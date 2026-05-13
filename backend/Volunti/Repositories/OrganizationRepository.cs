using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Repositories
{
    public class OrganizationRepository(VoluntiDbContext db) : IOrganizationRepository
    {
        public Task<List<Organization>> GetAllAsync() =>
            db.Organizations.ToListAsync();

        public Task<Organization?> GetByIdAsync(int id) =>
            db.Organizations.FindAsync(id).AsTask();

        public Task<Organization?> GetByUserIdAsync(int userId) =>
            db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId);

        public Task<Organization?> GetWithJobsAsync(int id) =>
            db.Organizations.Include(o => o.Jobs).FirstOrDefaultAsync(o => o.OrganizationId == id);

        public async Task AddMemberAsync(OrganizationMember member)
        {
            db.OrganizationMembers.Add(member);
        }

        public async Task RemoveAsync(Organization org)
        {
            db.Organizations.Remove(org);
        }

        public async Task RemoveJobsRangeAsync(IEnumerable<Job> jobs)
        {
            db.Jobs.RemoveRange(jobs);
        }

        public Task SaveChangesAsync() =>
            db.SaveChangesAsync();
    }
}
