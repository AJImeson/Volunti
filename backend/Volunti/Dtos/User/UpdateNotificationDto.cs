namespace Volunti.DTOs.User
{
    public record UpdateNotificationDto(
        string NotificationPreference,
        bool EmailNotifications
    );
}