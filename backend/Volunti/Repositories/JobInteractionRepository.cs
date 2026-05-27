using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Repositories
{
    public class JobInteractionRepository(VoluntiDbContext db) : IJobInteractionRepository
    {
        // Job likes
        public Task<JobLike?> GetLikeAsync(int jobId, int userId) =>
            db.JobLikes.FirstOrDefaultAsync(jl => jl.JobId == jobId && jl.UserId == userId);

        public Task<int> GetLikeCountAsync(int jobId) =>
            db.JobLikes.CountAsync(jl => jl.JobId == jobId);

        public Task<bool> LikedByUserAsync(int jobId, int userId) =>
            db.JobLikes.AnyAsync(jl => jl.JobId == jobId && jl.UserId == userId);

        public void AddLike(JobLike like) => db.JobLikes.Add(like);

        public void RemoveLike(JobLike like) => db.JobLikes.Remove(like);

        // Comments
        public Task<List<JobComment>> GetCommentsByJobAsync(int jobId) =>
            db.JobComments
                .Where(c => c.JobId == jobId && c.ParentCommentId == null)
                .Include(c => c.User).ThenInclude(u => u.Volunteer)
                .Include(c => c.User).ThenInclude(u => u.Organization)
                .Include(c => c.Replies).ThenInclude(r => r.User).ThenInclude(u => u.Volunteer)
                .Include(c => c.Replies).ThenInclude(r => r.User).ThenInclude(u => u.Organization)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

        public Task<JobComment?> GetCommentWithRepliesAsync(int commentId) =>
            db.JobComments
                .Include(c => c.Replies)
                .FirstOrDefaultAsync(c => c.Id == commentId);

        public Task<JobComment?> GetCommentByIdAsync(int commentId) =>
            db.JobComments
                .Include(c => c.User).ThenInclude(u => u.Volunteer)
                .Include(c => c.User).ThenInclude(u => u.Organization)
                .FirstOrDefaultAsync(c => c.Id == commentId);

        public void AddComment(JobComment comment) => db.JobComments.Add(comment);

        public void RemoveComment(JobComment comment) => db.JobComments.Remove(comment);

        public void RemoveCommentsRange(IEnumerable<JobComment> comments) =>
            db.JobComments.RemoveRange(comments);

        // Comment likes
        public Task<JobCommentLike?> GetCommentLikeAsync(int commentId, int userId) =>
            db.JobCommentLikes.FirstOrDefaultAsync(cl => cl.CommentId == commentId && cl.UserId == userId);

        public Task<int> GetCommentLikeCountAsync(int commentId) =>
            db.JobCommentLikes.CountAsync(cl => cl.CommentId == commentId);

        public Task<Dictionary<int, int>> GetCommentLikeCountsAsync(List<int> commentIds) =>
            db.JobCommentLikes
                .Where(cl => commentIds.Contains(cl.CommentId))
                .GroupBy(cl => cl.CommentId)
                .Select(g => new { CommentId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.CommentId, x => x.Count);

        public async Task<HashSet<int>> GetLikedCommentIdsByUserAsync(List<int> commentIds, int userId)
        {
            var ids = await db.JobCommentLikes
                .Where(cl => commentIds.Contains(cl.CommentId) && cl.UserId == userId)
                .Select(cl => cl.CommentId)
                .ToListAsync();
            return ids.ToHashSet();
        }

        public void AddCommentLike(JobCommentLike like) => db.JobCommentLikes.Add(like);

        public void RemoveCommentLike(JobCommentLike like) => db.JobCommentLikes.Remove(like);

        public Task SaveChangesAsync() => db.SaveChangesAsync();
    }
}
