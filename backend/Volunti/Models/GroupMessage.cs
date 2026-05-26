namespace Volunti.Models
{
    public class GroupMessage
    {
        public int Id { get; set; }

        public int MessageGroupId { get; set; }
        public MessageGroup MessageGroup { get; set; } = null!;

        public int SenderUserId { get; set; }
        public AppUser SenderUser { get; set; } = null!;

        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<GroupMessageAttachment> Attachments { get; set; } = new();
    }
}