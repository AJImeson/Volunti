namespace Volunti.Models
{
    public class JobCommentLike
    {
        public int Id { get; set; }
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public JobComment Comment { get; set; } = null!;
        public AppUser User { get; set; } = null!;
    }
}