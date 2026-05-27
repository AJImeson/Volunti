using Volunti.DTOs.Job;

namespace Volunti.Interfaces
{
    public interface IJobInteractionService
    {
        Task<(bool success, object? data, string? error)> ToggleLikeAsync(int jobId, int userId);
        Task<object> GetLikesAsync(int jobId, int? userId);
        Task<(bool success, object? data, string? error)> GetCommentsAsync(int jobId, int? userId);
        Task<(bool success, object? data, string? error)> AddCommentAsync(int jobId, int userId, CreateCommentDto dto);
        Task<(bool success, string? error)> DeleteCommentAsync(int jobId, int commentId, int userId);
        Task<(bool success, object? data, string? error)> ToggleCommentLikeAsync(int commentId, int userId);
    }
}
