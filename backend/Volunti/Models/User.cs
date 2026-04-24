using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
    public class User
    {
        public int Id { get; set; }
        //public Guid UserId { get; set; }
        [Required, MaxLength(50)]
        public string UserName { get; set; }
        [MaxLength(20)]
        public string PhoneNumber { get; set; }
        [EmailAddress, Required]
        [StringLength(254)]
        public string Email { get; set; }
        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; }


        public int RoleId { get; set; }
        public Role Role { get; set; }

        public List<PasswordResetToken> PasswordResetTokens { get; set; } = new();
    }
}