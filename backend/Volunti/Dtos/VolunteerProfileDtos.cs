namespace Volunti.DTOs
{
    public record AddTitleDto(string Title);

    public record AddExperienceDto(
        string Title,
        string? Organization,
        DateTime? StartDate,
        DateTime? EndDate,
        string? Description,
        int? HoursTotal
    );
}
