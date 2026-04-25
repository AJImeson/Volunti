
namespace api.Dtos.Organization
{
    public class CreateOrgDto
    {
       public string OrgName { get; set; } = string.Empty; 
    public string OrgNummer { get; set; } = string.Empty; 
    public string Description { get; set; } = string.Empty; 
    public string? City { get; set; }

    public string? ProfilImageUrl { get; set; } 

    public string? Website { get; set; } 

    
 
    }
}