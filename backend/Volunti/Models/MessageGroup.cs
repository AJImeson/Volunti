namespace Volunti.Models
{
    public class MessageGroup
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }

        public int OrganizationId { get; set; }
        public Organization Organization { get; set; } = null!;

        public int CreatedByUserId { get; set; }
        public AppUser CreatedByUser { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<MessageGroupMember> Members { get; set; } = new();
        public List<GroupMessage> Messages { get; set; } = new();
    }
}