namespace Volunti.Dtos.Job
{
    public class JobDto
    {
        public int JobId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Category { get; set; }  // Change to Enum later
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? Address { get; set; }

        public string? City { get; set; }

        public bool IsUrgent { get; set; }

        public string? Status { get; set; } // Change to Enum later

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public int? OrganizationId { get; set; }

        public OrgSummaryDto? Organization { get; set; }
    }

    public class OrgSummaryDto
    {
        public int OrganizationId { get; set; }
        public string OrgName { get; set; } = string.Empty;
        public string? ContactName { get; set; }
        public string? ProfileImageUrl { get; set; }
    }
}