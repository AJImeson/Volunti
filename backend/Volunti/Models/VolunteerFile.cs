using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Volunti.Models
{
    public class VolunteerFile
    {
        public int Id { get; set; }

        [Required]
        public int VolunteerId { get; set; }

        [ForeignKey(nameof(VolunteerId))]
        public Volunteer Volunteer { get; set; } = null!;

        // Vilken kategori filen tillhör
        [Required, MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        // Originalnamnet som användaren laddade upp
        [Required, MaxLength(255)]
        public string OriginalFileName { get; set; } = string.Empty;

        // Slumpat filnamn på disk
        [Required, MaxLength(255)]
        public string StoredFileName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string ContentType { get; set; } = string.Empty;

        public long FileSizeBytes { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        public int? ExperienceId { get; set; }
    }
}