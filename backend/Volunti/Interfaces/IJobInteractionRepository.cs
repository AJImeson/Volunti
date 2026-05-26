using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IJobInteractionRepository
    {
        // Job likes
        Task<JobLike?> GetLikeAsync(int jobId, int userId);
        Task<int> GetLikeCountAsync(int jobId);
        Task<bool> LikedByUserAsync(int jobId, int userId);
        void AddLike(JobLike like);
        void RemoveLike(JobLike like);

        // Comments
        Task<List<JobComment>> GetCommentsByJobAsync(int jobId);
        Task<JobComment?> GetCommentWithRepliesAsync(int commentId);
        Task<JobComment?> GetCommentByIdAsync(int commentId);
        void AddComment(JobComment comment);
        void RemoveComment(JobComment comment);
        void RemoveCommentsRange(IEnumerable<JobComment> comments);

        // Comment likes
        Task<JobCommentLike?> GetCommentLikeAsync(int commentId, int userId);
        Task<int> GetCommentLikeCountAsync(int commentId);
        Task<Dictionary<int, int>> GetCommentLikeCountsAsync(List<int> commentIds);
        Task<HashSet<int>> GetLikedCommentIdsByUserAsync(List<int> commentIds, int userId);
        void AddCommentLike(JobCommentLike like);
        void RemoveCommentLike(JobCommentLike like);

        Task SaveChangesAsync();
    }
}
