using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Volunti.Models
{
  public class Organization
  {
    public Guid OrganizationId { get; set; }
    public string OrgName { get; set; } = string.Empty;
    public string OrgNummer { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? City { get; set; }

    public string? ProfilImageUrl { get; set; }

    public string? Website { get; set; }

    public List<Job> Jobs { get; set; } = new List<Job>();

    public int UserId { get; set; }
    public AppUser User { get; set; }

    public int RoleId { get; set; }
    public Role Role { get; set; }

  }
}