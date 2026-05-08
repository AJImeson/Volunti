using Volunti.Models;

namespace Volunti.DTOs
{
    public class CreateJobDto
    {
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public JobCategory? Category { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string? Address { get; set; }

        public string? City { get; set; }

        public bool IsUrgent { get; set; }

        public int? OrganizationId { get; set; }
    }
}