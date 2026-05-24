using Volunti.Models;

namespace Volunti.DTOs.Job
{
    public class ApplicationDto
    {
        public int ApplicationId { get; set; }
        public ApplicationStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int VolunteerId { get; set; }
        public int JobId { get; set; }
       
    }
  
}

