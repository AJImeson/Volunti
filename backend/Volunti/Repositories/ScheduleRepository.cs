using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Repositories
{
    public class ScheduleRepository(VoluntiDbContext db) : IScheduleRepository
    {
        public Task<List<VolunteerAvailability>> GetByVolunteerAsync(int volunteerId) =>
            db.VolunteerAvailabilities
                .Where(va => va.VolunteerId == volunteerId)
                .OrderBy(va => va.Date)
                .ToListAsync();

        public Task RemoveRangeAsync(List<VolunteerAvailability> items)
        {
            db.VolunteerAvailabilities.RemoveRange(items);
            return Task.CompletedTask;
        }

        public Task AddRangeAsync(List<VolunteerAvailability> items)
        {
            db.VolunteerAvailabilities.AddRange(items);
            return Task.CompletedTask;
        }

        public Task SaveChangesAsync() => db.SaveChangesAsync();
    }
}
