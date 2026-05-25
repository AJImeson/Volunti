using Volunti.DTOs.Job;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Service
{
    public class ApplicationService(
        IApplicationRepository appRepo,
        IOrganizationRepository orgRepo,
        IVolunteerRepository volunteerRepo,
        IJobRepository jobRepo) : IApplicationService
    {
        public async Task<(bool success, List<VolunteerApplication>? data, string? error)> GetByOrganizationAsync(int userId, string? status)
        {
            var org = await orgRepo.GetByUserIdAsync(userId);
            if (org == null)
                return (false, null, "Användaren har ingen organisation.");

            ApplicationStatus? parsedStatus = null;
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<ApplicationStatus>(status, true, out var s))
                parsedStatus = s;

            var applications = await appRepo.GetByOrganizationAsync(org.OrganizationId, parsedStatus);
            return (true, applications, null);
        }

        public async Task<(bool success, ApplicationDto? dto, string? error)> ApplyAsync(int jobId, int userId)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId);
            if (volunteer == null)
                return (false, null, "Volontären hittades inte.");

            var job = await jobRepo.GetByIdAsync(jobId);
            if (job == null)
                return (false, null, "Jobbet hittades inte.");

            if (await appRepo.ExistsAsync(volunteer.Id, jobId))
                return (false, null, "conflict");

            var application = new VolunteerApplication
            {
                VolunteerId = volunteer.Id,
                JobId = jobId,
                Status = ApplicationStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            appRepo.Add(application);
            await appRepo.SaveChangesAsync();

            return (true, new ApplicationDto
            {
                ApplicationId = application.Id,
                Status = application.Status,
                CreatedAt = application.CreatedAt,
                VolunteerId = application.VolunteerId,
                JobId = application.JobId
            }, null);
        }

        public async Task<(bool success, ApplicationDto? dto, string? error)> UpdateStatusAsync(int applicationId, int userId, UpdateApplicationDto dto)
        {
            var application = await appRepo.GetByIdWithJobAsync(applicationId);
            if (application == null)
                return (false, null, "NotFound");

            var org = await orgRepo.GetByUserIdAsync(userId);
            if (org == null)
                return (false, null, "NotFound");

            if (application.Job.OrganizationId != org.OrganizationId)
                return (false, null, "Du har inte behörighet att hantera denna ansökan.");

            if (application.Status != ApplicationStatus.Pending)
                return (false, null, "Ansökan är redan behandlad.");

            if (dto.Status != ApplicationStatus.Approved && dto.Status != ApplicationStatus.Rejected)
                return (false, null, "Status måste vara Approved eller Rejected.");

            application.Status = dto.Status;
            await appRepo.SaveChangesAsync();

            return (true, new ApplicationDto
            {
                ApplicationId = application.Id,
                Status = application.Status,
                CreatedAt = application.CreatedAt,
                VolunteerId = application.VolunteerId,
                JobId = application.JobId
            }, null);
        }

        public async Task<(bool success, List<VolunteerApplication>? data, string? error)> GetByVolunteerAsync(int userId)
        {
            var volunteer = await volunteerRepo.GetByUserIdAsync(userId);
            if (volunteer == null)
                return (false, null, "Volontären hittades inte.");

            var applications = await appRepo.GetByVolunteerAsync(volunteer.Id);
            return (true, applications, null);
        }
    }
}
