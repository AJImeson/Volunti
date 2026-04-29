using Microsoft.AspNetCore.Identity;

namespace Volunti.Models
{
    public class AppUser : IdentityUser<int>
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public List<PasswordResetToken> PasswordResetTokens { get; set; } = new();
    }
}
