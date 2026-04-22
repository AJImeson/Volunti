using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
    public class Job
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 4)]
        public string Title { get; set; }
        [StringLength(50, MinimumLength = 5)]
        public string Description { get; set; }
        [StringLength(50, MinimumLength = 4)]
        public string Category { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        [StringLength(200, MinimumLength = 4)]
        public string Address { get; set; }
        [StringLength(100, MinimumLength = 4)]
        public string City { get; set; }
        public bool IsUrgent { get; set; }
        public JobStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public int OrganizationId { get; set; }
        public Organization Organization { get; set; }

        public List<VolunteerApplication> VolunteerApplications { get; set; }
    }

    public enum JobStatus
    {
        Open,
        Closed,
        Cancelled
    }
}