using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Volunti.Models
{
    public class Role : IdentityRole<int>
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string RoleType { get; set; }


        public List<AppUser> Users { get; set; }
        public List<Volunteer> Volunteers { get; set; }
        public List<Organization> Organizations { get; set; }
    }
}