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
                Category = job.Category,
                StartTime = job.StartTime,
                EndTime = job.EndTime,
                Adress = job.Adress,
                City = job.City,
                IsUrgent = job.IsUrgent,
                Status = job.Status,
                CreatedOn = job.CreatedOn,
                OrganizationId = job.OrganizationId
            };
        }
    }
}