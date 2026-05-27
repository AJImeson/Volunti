namespace Volunti.Interfaces
{
    public interface IScheduleService
    {
        Task<(bool success, List<DateTime>? dates, string? error)> GetAvailabilityAsync(int userId);
        Task<(bool success, List<DateTime>? dates, string? error)> UpdateAvailabilityAsync(int userId, List<DateTime> dates);
    }
}
