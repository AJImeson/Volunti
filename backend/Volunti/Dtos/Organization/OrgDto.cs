
namespace Volunti.Dtos.Organization 
{
    public class OrgDto
    {
    public Guid OrganizationId { get; set; }
    public string OrgName { get; set; } = string.Empty; 
    public string OrgNummer { get; set; } = string.Empty; 
    public string Description { get; set; } = string.Empty; 
    public string? City { get; set; }

    public string? ProfilImageUrl { get; set; } 

    public string? Website { get; set; } 
 
    }
}