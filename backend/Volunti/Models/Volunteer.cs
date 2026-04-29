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
        [MaxLength(255)]
        public string ProfileImageUrl { get; set; }
        public bool IsVerified { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime AvailableTo { get; set; }


        [Required]
        public int UserId { get; set; }
        public AppUser User { get; set; }

        public int RoleId { get; set; }
        public Role Role { get; set; }

        
        public List<VolunteerInterest> VolunteerInterests { get; set; }
        public List<VolunteerSkill> VolunteerSkills { get; set; }
    }
}