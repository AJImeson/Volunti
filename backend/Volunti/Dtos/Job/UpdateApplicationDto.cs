using Volunti.Models;

namespace Volunti.DTOs.Job
{
    public class UpdateApplicationDto
    {
        public ApplicationStatus Status { get; set; } // Property med get; set; för att läsa och skriva när status blir Approved eller Rejected av Orgadmin
    }
}
