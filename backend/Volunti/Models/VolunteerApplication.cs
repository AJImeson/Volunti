using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
    public class VolunteerApplication
    {
        public int Id { get; set; }
        public ApplicationStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int VolunteerId { get; set; }
        public Volunteer Volunteer { get; set; }


        public int JobId { get; set; }
        public Job Job { get; set; }
    }
        public enum ApplicationStatus
        {
            Pending,
            Approved,
            Rejected
        }
}