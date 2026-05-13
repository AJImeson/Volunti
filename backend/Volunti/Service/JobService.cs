using Volunti.DTOs;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Service
{
    public class JobService(IJobRepository jobRepo, IOrganizationRepository orgRepo) : IJobService
    {
        public Task<List<Job>> GetAllAsync() => jobRepo.GetAllAsync();

        public async Task<(bool success, List<Job>? jobs, string? error)> GetByUserAsync(int userId)
        {
            var organization = await orgRepo.GetByUserIdAsync(userId);
            if (organization == null)
                return (false, null, "Användaren har ingen organisation.");
            var jobs = await jobRepo.GetByOrganizationIdAsync(organization.OrganizationId);
            return (true, jobs, null);
        }

        public Task<Job?> GetByIdAsync(int id) => jobRepo.GetByIdAsync(id);

        public async Task<(bool success, Job? job, string? error)> CreateAsync(CreateJobDto dto, int userId, bool isAdmin)
        {
            if (dto.StartTime >= dto.EndTime)
                return (false, null, "Endtime måste vara efter StartTime.");

            Organization? organization;

            if (isAdmin)
            {
                if (dto.OrganizationId == null)
                    return (false, null, "OrganisationId krävs för Admin.");

                organization = await orgRepo.GetByIdAsync(dto.OrganizationId.Value);
                if (organization == null)
                    return (false, null, "Ogiltigt OrganisationId.");
            }
            else
            {
                organization = await orgRepo.GetByUserIdAsync(userId);
                if (organization == null)
                    return (false, null, "Användaren har ingen organisation");
            }

            var job = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Address = dto.Address,
                City = dto.City,
                IsUrgent = dto.IsUrgent,
                OrganizationId = organization.OrganizationId,
                CreatedOn = DateTime.UtcNow,
                Status = JobStatus.Open
            };

            await jobRepo.AddAsync(job);
            await jobRepo.SaveChangesAsync();
            return (true, job, null);
        }

        public async Task<(bool success, string? error)> DeleteAsync(int id, int userId, bool isAdmin)
        {
            var job = await jobRepo.GetByIdAsync(id);
            if (job == null)
                return (false, "Jobbet hittades inte.");

            var organization = await orgRepo.GetByUserIdAsync(userId);

            if (!isAdmin && (organization == null || job.OrganizationId != organization.OrganizationId))
                return (false, "Du har inte behörighet att ta bort detta jobb.");

            await jobRepo.RemoveAsync(job);
            await jobRepo.SaveChangesAsync();
            return (true, null);
        }
    }
}
