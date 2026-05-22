using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IScheduleRepository
    {
        Task<List<VolunteerAvailability>> GetByVolunteerAsync(int volunteerId);
        Task RemoveRangeAsync(List<VolunteerAvailability> items);
        Task AddRangeAsync(List<VolunteerAvailability> items);
        Task SaveChangesAsync();
    }
}
