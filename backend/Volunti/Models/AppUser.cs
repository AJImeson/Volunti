using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Volunti.Models
{
    public class AppUser : IdentityUser<int>
    {
        [Required, MaxLength(50)]
        public string UserName { get; set; }       
        [StringLength(254)]
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public List<PasswordResetToken> PasswordResetTokens { get; set; } = new();

    }
}