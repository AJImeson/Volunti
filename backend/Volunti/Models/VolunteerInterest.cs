using System.ComponentModel.DataAnnotations;

namespace Volunti.Models
{
    public class VolunteerInterest
    {
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        [Required]
        [StringLength(1000)]
        public string Description { get; set; }

        public List<Volunteer> Volunteers { get; set; }
    }
}