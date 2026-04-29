using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Volunti.Models
{
  public class Organization
  {
    public int OrganizationId { get; set; }
    public string OrgName { get; set; } 
    public string OrgNummer { get; set; } 
    public string Description { get; set; } 
    public string City { get; set; }

    public string ProfileImageUrl { get; set; }

    public string Website { get; set; }

    public List<Job> Jobs { get; set; } = new List<Job>();
    public List<OrganizationMember> Members { get; set; } = new List<OrganizationMember>();

    public int UserId { get; set; }
    public AppUser User { get; set; }

    //public int RoleId { get; set; }
    //public Role Role { get; set; }

  }
}