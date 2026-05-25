using Volunti.DTOs.Job;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Service
{
    public class JobInteractionService(IJobInteractionRepository interactionRepo, IJobRepository jobRepo) : IJobInteractionService
    {
        public async Task<(bool success, object? data, string? error)> ToggleLikeAsync(int jobId, int userId)
        {
            var job = await jobRepo.GetByIdAsync(jobId);
            if (job == null)
                return (false, null, "Jobbet hittades inte.");

            var existing = await interactionRepo.GetLikeAsync(jobId, userId);
            bool liked;
            if (existing != null)
            {
                interactionRepo.RemoveLike(existing);
                liked = false;
            }
            else
            {
                interactionRepo.AddLike(new JobLike { JobId = jobId, UserId = userId });
                liked = true;
            }

            await interactionRepo.SaveChangesAsync();
            var count = await interactionRepo.GetLikeCountAsync(jobId);
            return (true, new { liked, count }, null);
        }

        public async Task<object> GetLikesAsync(int jobId, int? userId)
        {
            var count = await interactionRepo.GetLikeCountAsync(jobId);
            var likedByMe = userId.HasValue && await interactionRepo.LikedByUserAsync(jobId, userId.Value);
            return new { count, likedByMe };
        }

        public async Task<(bool success, object? data, string? error)> GetCommentsAsync(int jobId, int? userId)
        {
            var job = await jobRepo.GetByIdAsync(jobId);
            if (job == null)
                return (false, null, "NotFound");

            var comments = await interactionRepo.GetCommentsByJobAsync(jobId);

            var allCommentIds = comments
                .SelectMany(c => new[] { c.Id }.Concat(c.Replies.Select(r => r.Id)))
                .ToList();

            var likeCounts = await interactionRepo.GetCommentLikeCountsAsync(allCommentIds);
            var likedByMe = userId.HasValue
                ? await interactionRepo.GetLikedCommentIdsByUserAsync(allCommentIds, userId.Value)
                : new HashSet<int>();

            var mapped = comments.Select(c => MapComment(c, likeCounts, likedByMe));
            return (true, mapped, null);
        }

        public async Task<(bool success, object? data, string? error)> AddCommentAsync(int jobId, int userId, CreateCommentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Content))
                return (false, null, "Kommentaren får inte vara tom.");

            if (dto.Content.Length > 1000)
                return (false, null, "Kommentaren är för lång (max 1000 tecken).");

            var job = await jobRepo.GetByIdAsync(jobId);
            if (job == null)
                return (false, null, "Jobbet hittades inte.");

            int? actualParentId = dto.ParentCommentId;
            if (actualParentId.HasValue)
            {
                var parent = await interactionRepo.GetCommentByIdAsync(actualParentId.Value);
                if (parent == null || parent.JobId != jobId)
                    return (false, null, "Ogiltig parent-kommentar.");

                if (parent.ParentCommentId.HasValue)
                    actualParentId = parent.ParentCommentId;
            }

            var comment = new JobComment
            {
                JobId = jobId,
                UserId = userId,
                Content = dto.Content.Trim(),
                ParentCommentId = actualParentId,
                CreatedAt = DateTime.UtcNow
            };

            interactionRepo.AddComment(comment);
            await interactionRepo.SaveChangesAsync();

            var saved = await interactionRepo.GetCommentByIdAsync(comment.Id);

            var result = new
            {
                id = saved!.Id,
                content = saved.Content,
                createdAt = saved.CreatedAt,
                userId = saved.UserId,
                authorName = saved.User.Volunteer != null
                    ? $"{saved.User.Volunteer.FirstName} {saved.User.Volunteer.LastName}".Trim()
                    : (saved.User.Organization?.OrgName ?? saved.User.Organization?.CompanyName ?? "Okänd"),
                authorImageUrl = saved.User.Volunteer?.ProfileImageUrl ?? saved.User.Organization?.ProfileImageUrl,
                authorType = saved.User.Volunteer != null ? "Volunteer" : "Organization",
                parentCommentId = saved.ParentCommentId,
                likeCount = 0,
                likedByMe = false,
                replies = new List<object>()
            };

            return (true, result, null);
        }

        public async Task<(bool success, string? error)> DeleteCommentAsync(int jobId, int commentId, int userId)
        {
            var comment = await interactionRepo.GetCommentWithRepliesAsync(commentId);
            if (comment == null || comment.JobId != jobId)
                return (false, "NotFound");

            if (comment.UserId != userId)
                return (false, "Forbidden");

            if (comment.Replies.Any())
                interactionRepo.RemoveCommentsRange(comment.Replies);

            interactionRepo.RemoveComment(comment);
            await interactionRepo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, object? data, string? error)> ToggleCommentLikeAsync(int commentId, int userId)
        {
            var comment = await interactionRepo.GetCommentByIdAsync(commentId);
            if (comment == null)
                return (false, null, "Kommentaren hittades inte.");

            var existing = await interactionRepo.GetCommentLikeAsync(commentId, userId);
            bool liked;
            if (existing != null)
            {
                interactionRepo.RemoveCommentLike(existing);
                liked = false;
            }
            else
            {
                interactionRepo.AddCommentLike(new JobCommentLike { CommentId = commentId, UserId = userId });
                liked = true;
            }

            await interactionRepo.SaveChangesAsync();
            var count = await interactionRepo.GetCommentLikeCountAsync(commentId);
            return (true, new { liked, count }, null);
        }

        private object MapComment(JobComment c, Dictionary<int, int> likeCounts, HashSet<int> likedByMe) => new
        {
            id = c.Id,
            content = c.Content,
            createdAt = c.CreatedAt,
            userId = c.UserId,
            authorName = c.User.Volunteer != null
                ? $"{c.User.Volunteer.FirstName} {c.User.Volunteer.LastName}".Trim()
                : (c.User.Organization?.OrgName ?? c.User.Organization?.CompanyName ?? "Okänd"),
            authorImageUrl = c.User.Volunteer?.ProfileImageUrl ?? c.User.Organization?.ProfileImageUrl,
            authorType = c.User.Volunteer != null ? "Volunteer" : "Organization",
            parentCommentId = c.ParentCommentId,
            likeCount = likeCounts.TryGetValue(c.Id, out var lc) ? lc : 0,
            likedByMe = likedByMe.Contains(c.Id),
            replies = c.Replies
                .OrderBy(r => r.CreatedAt)
                .Select(r => (object)new
                {
                    id = r.Id,
                    content = r.Content,
                    createdAt = r.CreatedAt,
                    userId = r.UserId,
                    authorName = r.User.Volunteer != null
                        ? $"{r.User.Volunteer.FirstName} {r.User.Volunteer.LastName}".Trim()
                        : (r.User.Organization?.OrgName ?? r.User.Organization?.CompanyName ?? "Okänd"),
                    authorImageUrl = r.User.Volunteer?.ProfileImageUrl ?? r.User.Organization?.ProfileImageUrl,
                    authorType = r.User.Volunteer != null ? "Volunteer" : "Organization",
                    parentCommentId = r.ParentCommentId,
                    likeCount = likeCounts.TryGetValue(r.Id, out var rlc) ? rlc : 0,
                    likedByMe = likedByMe.Contains(r.Id)
                })
                .ToList()
        };
    }
}
