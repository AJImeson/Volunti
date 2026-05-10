using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Volunti.Models
{
    public class VolunteerExperience
    {
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(150)]
        public string Organization { get; set; } = string.Empty;

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public int? HoursTotal { get; set; }

        public int VolunteerId { get; set; }

        [ForeignKey(nameof(VolunteerId))]
        public Volunteer Volunteer { get; set; } = null!;
    }
}