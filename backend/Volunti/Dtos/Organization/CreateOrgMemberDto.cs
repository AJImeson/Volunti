using System.ComponentModel.DataAnnotations;

namespace Volunti.Dtos.Organization
{
    public class CreateOrgMemberDto
    {
        [Required, EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}
