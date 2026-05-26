namespace Volunti.Models
{
    public class GroupMessageAttachment
    {
        public int Id { get; set; }

        public int GroupMessageId { get; set; }
        public GroupMessage GroupMessage { get; set; } = null!;

        public string OriginalFileName { get; set; } = string.Empty;
        public string StoredFileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public bool IsImage { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}