using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IScheduleRepository
    {
        Task<List<VolunteerAvailability>> GetByVolunteerAsync(int volunteerId);
        void RemoveRange(List<VolunteerAvailability> items);
        void AddRange(List<VolunteerAvailability> items);
        Task SaveChangesAsync();
    }
}
