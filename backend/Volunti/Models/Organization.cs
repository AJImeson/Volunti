using System.Collections.Generic;

namespace Volunti.Models
{
    public class Organization
    {
        public int OrganizationId { get; set; }

        public string CompanyName { get; set; }
        public string OrgName { get; set; }
        public string ContactName { get; set; }
        public string OrgNumber { get; set; }
        public string Description { get; set; }
        public string Municipality { get; set; }
        public string ProfileImageUrl { get; set; }
        public string Website { get; set; }

        public bool RequiresDocumentation { get; set; }
        public string? NotificationPreference { get; set; }
        public bool EmailNotifications { get; set; }

        public string Categories { get; set; } = string.Empty;

        public List<Job> Jobs { get; set; } = new List<Job>();
        public List<OrganizationMember> Members { get; set; } = new List<OrganizationMember>();

        public int UserId { get; set; }
        public AppUser User { get; set; }

        // Profile
        public string? Bio { get; set; }
        public string? Areas { get; set; }              
        public string? TargetGroup { get; set; }        
        public string? Requirements { get; set; }       
        public string? Activities { get; set; }         

        // Verifiering
        public DateTime? VerifiedAt { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonEmail { get; set; }
        public string? ContactPersonPhone { get; set; }
        public DateTime? ContactPersonAddedAt { get; set; }
    }
}