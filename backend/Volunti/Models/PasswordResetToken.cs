
using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
  public class PasswordResetToken
  {
    public int Id { get; set; }
    [Required]
    [StringLength(100)]
    public string TokenHash { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; }
  }
}