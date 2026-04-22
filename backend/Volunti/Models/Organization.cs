using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
    public class Organization
    {
        public int Id { get; set; }
        [Required]
        [StringLength(150)]
        public string OrgName { get; set; }
        [Required]
        [StringLength(50)]
        public string OrgNumber { get; set; }
        [Required]
        [StringLength(1000)]
        public string Description { get; set; }
        [Required]
        [StringLength(100)]
        public string City { get; set; }
        [StringLength(500)]
        public string ProfileImageUrl { get; set; } = "default.png";
        [StringLength(300)]
        [Url]
        public string Website { get; set; }
        [Required]
        [StringLength(200)]
        public string Address { get; set; }


        public int UserId { get; set; }
        public User User { get; set; }


        public int RoleId { get; set; }
        public Role Role { get; set; }

        public List<Job> Jobs { get; set; }
    }
}