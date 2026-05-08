using Microsoft.AspNetCore.Identity;

namespace Volunti.Models
{
    public class AppUser : IdentityUser<int>
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public List<PasswordResetToken> PasswordResetTokens { get; set; } = new();

        public Volunteer? Volunteer { get; set; }
        public Organization? Organization { get; set; }
        public OrganizationMember? OrganizationMember { get; set; }
    }
}
