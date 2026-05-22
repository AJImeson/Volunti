using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IJobInteractionRepository
    {
        // Job likes
        Task<JobLike?> GetLikeAsync(int jobId, int userId);
        Task<int> GetLikeCountAsync(int jobId);
        Task<bool> LikedByUserAsync(int jobId, int userId);
        Task AddLikeAsync(JobLike like);
        Task RemoveLikeAsync(JobLike like);

        // Comments
        Task<List<JobComment>> GetCommentsByJobAsync(int jobId);
        Task<JobComment?> GetCommentWithRepliesAsync(int commentId);
        Task<JobComment?> GetCommentByIdAsync(int commentId);
        Task AddCommentAsync(JobComment comment);
        Task RemoveCommentAsync(JobComment comment);
        Task RemoveCommentsRangeAsync(IEnumerable<JobComment> comments);

        // Comment likes
        Task<JobCommentLike?> GetCommentLikeAsync(int commentId, int userId);
        Task<int> GetCommentLikeCountAsync(int commentId);
        Task<Dictionary<int, int>> GetCommentLikeCountsAsync(List<int> commentIds);
        Task<HashSet<int>> GetLikedCommentIdsByUserAsync(List<int> commentIds, int userId);
        Task AddCommentLikeAsync(JobCommentLike like);
        Task RemoveCommentLikeAsync(JobCommentLike like);

        Task SaveChangesAsync();
    }
}
