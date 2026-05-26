using System; 
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Volunti.Models
{
  public class Job
  {
    public int JobId { get; set; }

    public string Title { get; set; } = string.Empty; 

    public string? Description { get; set; }
    public JobCategory? Category { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? Address { get; set; }

    public string? City { get; set; }

    public bool IsUrgent { get; set; }

    public JobStatus Status { get; set; } = JobStatus.Open;

    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    
    public int? OrganizationId { get; set; }

    public Organization? Organization {get; set; }


  }
}