using System; 
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Volunti.Models
{
  public class Job
  {
    public Guid JobId { get; set; }

    public string Title { get; set; } = string.Empty; 

    public string? Description { get; set; }
    public string? Category { get; set; }  // Change to Enum later
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? Adress { get; set; }

    public string? City { get; set; }

    public bool IsUrgent { get; set; }

    public string? Status { get; set; } // Change to Enum later

    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    
    public Guid? OrganizationId {get; set; }

    public Organization? Organization {get; set; }


  }
}