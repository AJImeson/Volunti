using System.ComponentModel.DataAnnotations;

namespace Volunti.Dtos.User
{
    public class RegisterDto
    {
        [Required]
        public string? FullName {get; set;}
        [Required]
        [EmailAddress]
        public string? Email {get; set; }
        [Required]
        public string? Password {get; set; }

        [Required]
        public string? Role { get; set; } // "Volunteer" or "Organization"
    }
}