using System.ComponentModel.DataAnnotations;

namespace Volunti.Dtos.User
{
    public class RegisterOrganizationDto
    {
        [Required, EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }

        [Required]
        public string? CompanyName { get; set; }     // Företagsnamn 
        [Required]
        public string? OrgName { get; set; }         // Organisationsnamn
        [Required]
        public string? ContactName { get; set; }     // Namn (contact person)

        // OrgNumber not in form — make optional or remove
        public string? OrgNumber { get; set; }

        public string? Description { get; set; }     // Step 2 textarea
        [Required]
        public string? Municipality { get; set; }    // Kommun 

        public string? ProfileImageUrl { get; set; }
        public string? Website { get; set; }

        // Step 3
        public List<string>? Categories { get; set; }   // Bransch 
        public bool RequiresDocumentation { get; set; } // Behövs dokumentation 

        // Step 4
        public string? NotificationPreference { get; set; }  // Rekommenderat/Minimalt/Allt 
        public bool EmailNotifications { get; set; }         // Ja/Nej 
    }
}