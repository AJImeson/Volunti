namespace Volunti.Dtos.Organization
{
    public class OrgDto
    {
        public int OrganizationId { get; set; }
        public string OrgName { get; set; } = string.Empty;
        public string OrgNumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? Website { get; set; }
        public string? CompanyName { get; set; }
        public string? ContactName { get; set; }
        public string? Email { get; set; }

        // Profile
        public string? Bio { get; set; }
        public string[] Areas { get; set; } = Array.Empty<string>();
        public string[] TargetGroup { get; set; } = Array.Empty<string>();
        public string[] Requirements { get; set; } = Array.Empty<string>();
        public string[] Activities { get; set; } = Array.Empty<string>();

        // Verifiering
        public DateTime? VerifiedAt { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonEmail { get; set; }
        public string? ContactPersonPhone { get; set; }
        public DateTime? ContactPersonAddedAt { get; set; }
    }

    public class UpdateOrgProfileDto
    {
        public string? OrgName { get; set; }
        public string? Description { get; set; }
        public string? City { get; set; }
        public string? Website { get; set; }
        public string? Bio { get; set; }
        public string[]? Areas { get; set; }
        public string[]? TargetGroup { get; set; }
        public string[]? Requirements { get; set; }
        public string[]? Activities { get; set; }
        public string? OrgNumber { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonEmail { get; set; }
        public string? ContactPersonPhone { get; set; }
    }
}