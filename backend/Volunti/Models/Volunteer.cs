using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
    public class Volunteer
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string FirstName { get; set; }
        
        [Required, MaxLength(50)]
        public string LastName { get; set; }
        
        public DateTime DateOfBirth { get; set; }
        
        [MaxLength(500)]
        public string Bio { get; set; }

        [Required, MaxLength(255)]
        public string PhoneNumber { get; set; }

        [Required]
        public string? Muncipilaity { get; set; } //Kommun

        [Required]
        public string? DriverLicense { get; set; }   

        public string ProfileImageUrl { get; set; }
        public bool IsVerified { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime AvailableTo { get; set; }

        [Required]
        public string? Availability { get; set; } // Vardag, Kvällar, Helger etc.
        [Required]
        public int? MaxDistanceKm { get; set; } // distance in km

        public string? NotificationPreference { get; set; } // (Rekommenderat/Minimalt/Allt)

        public bool EmailNotifications {  get; set; } // (Ja/Nej)


        [Required]
        public int UserId { get; set; }
        public AppUser User { get; set; }

        //public int RoleId { get; set; }
        //public Role Role { get; set; }


        public List<VolunteerInterest> VolunteerInterests { get; set; }
        public List<VolunteerSkill> VolunteerSkills { get; set; }

      
       
    }
}