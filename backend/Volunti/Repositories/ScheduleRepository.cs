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

        public void RemoveRange(List<VolunteerAvailability> items) =>
            db.VolunteerAvailabilities.RemoveRange(items);

        public void AddRange(List<VolunteerAvailability> items) =>
            db.VolunteerAvailabilities.AddRange(items);

        public Task SaveChangesAsync() => db.SaveChangesAsync();
    }
}
