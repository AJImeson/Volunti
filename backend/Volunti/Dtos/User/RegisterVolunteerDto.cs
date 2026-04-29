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
        public DateTime? DateOfBirth { get; set; }
        public string? Bio { get; set; }
        public string? ProfileImageUrl { get; set; }
    }
}
