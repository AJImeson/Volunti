namespace Volunti.Models
{
    public class VolunteerAvailability
    {
        public int Id { get; set; }
        public int VolunteerId { get; set; }
        public DateTime Date { get; set; }
        public Volunteer Volunteer { get; set; } = null!;
    }
}