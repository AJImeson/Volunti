using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Service
{
    public class ScheduleService(IScheduleRepository scheduleRepo, IVolunteerRepository volunteerRepo) : IScheduleService
    {
        public async Task<(bool success, List<DateTime>? dates, string? error)> GetAvailabilityAsync(int userId)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId);
            if (volunteer == null)
                return (false, null, "Volontären hittades inte.");

            var items = await scheduleRepo.GetByVolunteerAsync(volunteer.Id);
            return (true, items.Select(va => va.Date).ToList(), null);
        }

        public async Task<(bool success, List<DateTime>? dates, string? error)> UpdateAvailabilityAsync(int userId, List<DateTime> dates)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId);
            if (volunteer == null)
                return (false, null, "Volontären hittades inte.");

            var existing = await scheduleRepo.GetByVolunteerAsync(volunteer.Id);
            await scheduleRepo.RemoveRangeAsync(existing);

            var today = DateTime.UtcNow.Date;
            var distinctDates = dates
                .Select(d => DateTime.SpecifyKind(d.Date, DateTimeKind.Utc))
                .Where(d => d >= today)
                .Distinct()
                .ToList();

            await scheduleRepo.AddRangeAsync(distinctDates.Select(d => new VolunteerAvailability
            {
                VolunteerId = volunteer.Id,
                Date = d
            }).ToList());

            await scheduleRepo.SaveChangesAsync();
            return (true, distinctDates, null);
        }
    }
}
