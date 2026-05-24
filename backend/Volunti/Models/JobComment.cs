namespace Volunti.Models
{
    public class JobComment
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // För nästlade svar (en nivå djupt)
        public int? ParentCommentId { get; set; }

        public Job Job { get; set; } = null!;
        public AppUser User { get; set; } = null!;
        public JobComment? ParentComment { get; set; }
        public List<JobComment> Replies { get; set; } = new();
    }
}