using System.ComponentModel.DataAnnotations;

namespace Volunti.Dtos.User
{
    public class RegisterVolunteerDto
    {
        [Required, EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set; }
        [Required]
        public string? PhoneNumber { get; set; }

        [Required]
        public string? Muncipilaity { get; set; } 

        [Required]
        public string? DriverLicense { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Bio { get; set; }
        public string? ProfileImageUrl { get; set; }

        [Required]
        public string? Availability { get; set; } 
      
        public int? MaxDistanceKm { get; set; }

        public string? NotificationPreference { get; set; } 

        public bool EmailNotifications { get; set; } 


        // Listan med intressenamn från formuläret, t.ex. "Skola", "Miljö" - vi skapar VolunteerInterest-objekt i endpointen
        public List<string>? Interests { get; set; }
    }
}
