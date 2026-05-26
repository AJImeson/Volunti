
namespace Volunti.Dtos.Organization
{
    public class CreateOrgDto
    {
        public string OrgName { get; set; } = string.Empty;
        public string OrgNumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? City { get; set; }

        public string? ProfileImageUrl { get; set; }

        public string? Website { get; set; }



    }
}