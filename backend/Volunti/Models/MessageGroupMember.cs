namespace Volunti.Models
{
    public enum GroupMemberRole
    {
        Admin = 0,     // Org användare 
        Member = 1     // Volontär eller annan
    }

    public class MessageGroupMember
    {
        public int Id { get; set; }

        public int MessageGroupId { get; set; }
        public MessageGroup MessageGroup { get; set; } = null!;

        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public GroupMemberRole Role { get; set; } = GroupMemberRole.Member;
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        // För oläst-räknare: senaste meddelandet användaren läst
        public DateTime LastReadAt { get; set; } = DateTime.UtcNow;
    }
}