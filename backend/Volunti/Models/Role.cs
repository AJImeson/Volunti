using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
    public class Role
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string RoleType { get; set; }


        public List<User> Users { get; set; }
        public List<Volunteer> Volunteers { get; set; }
        public List<Organization> Organizations { get; set; }
    }
}