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
        public string? OrgName { get; set; }
        [Required]
        public string? OrgNummer { get; set; }
        public string? Description { get; set; }
        public string? City { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? Website { get; set; }
    }
}
