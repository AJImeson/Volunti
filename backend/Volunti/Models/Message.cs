using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Volunti.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }
        [StringLength(2000, MinimumLength = 1)]
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int SenderId { get; set; }
        [ForeignKey(nameof(SenderId))]
        public AppUser Sender { get; set; }

        public int ReceiverId { get; set; }
        [ForeignKey(nameof(ReceiverId))]
        public AppUser Receiver { get; set; }
    }
}