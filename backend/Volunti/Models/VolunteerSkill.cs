using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
    public class VolunteerSkill
    {
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        [StringLength(500)]
        public string Description { get; set; }


        public List<Volunteer> Volunteers { get; set; }
    }
}