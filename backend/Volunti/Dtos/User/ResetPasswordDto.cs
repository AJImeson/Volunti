using System.ComponentModel.DataAnnotations;

namespace Volunti.Dtos.User
{
    public class ResetPasswordDto
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Token { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}
