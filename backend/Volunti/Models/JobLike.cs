namespace Volunti.Models
{
    public class JobLike
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Job Job { get; set; } = null!;
        public AppUser User { get; set; } = null!;
    }
}