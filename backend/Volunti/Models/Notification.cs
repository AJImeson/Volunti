using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
    public class Notification
    {
        public int Id { get; set; }
        [Required]
        [StringLength(500, MinimumLength = 1)]
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public int UserId { get; set; }
        public User User { get; set; }
    }
}