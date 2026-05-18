using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volunti.Dtos.Job;

namespace Volunti.Mappers
{
    public static class JobMapper
    {
        public static JobDto ToJobDto(this Volunti.Models.Job job)
        {
            return new JobDto
            {
                JobId = job.JobId,
                Title = job.Title,
                Description = job.Description,
                Category = job.Category.ToString(),
                StartTime = job.StartTime,
                EndTime = job.EndTime,
                Address = job.Address,
                City = job.City,
                IsUrgent = job.IsUrgent,
                Status = job.Status.ToString(),
                CreatedOn = job.CreatedOn,
                OrganizationId = job.OrganizationId,
                Organization = job.Organization != null ? new OrgSummaryDto
                {
                    OrganizationId = job.Organization.OrganizationId,
                    OrgName = job.Organization.OrgName,
                    ContactName = job.Organization.ContactName,
                    ProfileImageUrl = job.Organization.ProfileImageUrl
                } : null
            };
        }
    }
}