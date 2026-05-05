using System.ComponentModel.DataAnnotations;

namespace Volunti.Dtos.User
{
    public class ForgotPasswordDto
    {
        [Required, EmailAddress]
        public string Email { get; set; }
    }
}
