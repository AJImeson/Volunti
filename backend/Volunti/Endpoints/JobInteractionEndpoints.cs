using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Volunti.Data;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class JobInteractionEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            /* ==========================================================================
               LIKES
               ========================================================================== */

            // toggla like 
            app.MapPost("/jobs/{id}/like", async (
                int id,
                VoluntiDbContext db,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var job = await db.Jobs.FindAsync(id);
                if (job == null) return Results.NotFound("Jobbet hittades inte.");

                var existing = await db.JobLikes
                    .FirstOrDefaultAsync(jl => jl.JobId == id && jl.UserId == userId);

                bool liked;
                if (existing != null)
                {
                    db.JobLikes.Remove(existing);
                    liked = false;
                }
                else
                {
                    db.JobLikes.Add(new JobLike
                    {
                        JobId = id,
                        UserId = userId
                    });
                    liked = true;
                }

                await db.SaveChangesAsync();

                var count = await db.JobLikes.CountAsync(jl => jl.JobId == id);

                return Results.Ok(new { liked, count });
            })
            .RequireAuthorization();

            // hämta antal likes
            app.MapGet("/jobs/{id}/likes", async (
                int id,
                VoluntiDbContext db,
                HttpContext http) =>
            {
                var likeCount = await db.JobLikes.CountAsync(jl => jl.JobId == id);
                var commentCount = await db.JobComments.CountAsync(c => c.JobId == id);

                bool likedByMe = false;
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim != null && int.TryParse(userIdClaim, out var userId))
                {
                    likedByMe = await db.JobLikes
                        .AnyAsync(jl => jl.JobId == id && jl.UserId == userId);
                }

                return Results.Ok(new { count = likeCount, likedByMe, commentCount });
            });

            /* ==========================================================================
               COMMENTS
               ========================================================================== */

            // hämta alla kommentarer för ett jobb 
            app.MapGet("/jobs/{id}/comments", async (
                int id,
                VoluntiDbContext db,
                HttpContext http) =>
            {
                var job = await db.Jobs.FindAsync(id);
                if (job == null) return Results.NotFound();

                int? currentUserId = null;
                var claim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (claim != null && int.TryParse(claim, out var uid))
                    currentUserId = uid;

                var comments = await db.JobComments
                    .Where(c => c.JobId == id && c.ParentCommentId == null)
                    .Include(c => c.User).ThenInclude(u => u.Volunteer)
                    .Include(c => c.User).ThenInclude(u => u.Organization)
                    .Include(c => c.Replies).ThenInclude(r => r.User).ThenInclude(u => u.Volunteer)
                    .Include(c => c.Replies).ThenInclude(r => r.User).ThenInclude(u => u.Organization)
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                // Hämta likes 
                var allCommentIds = comments
                    .SelectMany(c => new[] { c.Id }.Concat(c.Replies.Select(r => r.Id)))
                    .ToList();

                var likeCounts = await db.JobCommentLikes
                    .Where(cl => allCommentIds.Contains(cl.CommentId))
                    .GroupBy(cl => cl.CommentId)
                    .Select(g => new { CommentId = g.Key, Count = g.Count() })
                    .ToDictionaryAsync(x => x.CommentId, x => x.Count);

                var likedByMe = new HashSet<int>();
                if (currentUserId.HasValue)
                {
                    likedByMe = (await db.JobCommentLikes
                        .Where(cl => allCommentIds.Contains(cl.CommentId) && cl.UserId == currentUserId.Value)
                        .Select(cl => cl.CommentId)
                        .ToListAsync()).ToHashSet();
                }

                object MapComment(JobComment c) => new
                {
                    id = c.Id,
                    content = c.Content,
                    createdAt = c.CreatedAt,
                    userId = c.UserId,
                    authorName = c.User.Volunteer != null
                        ? $"{c.User.Volunteer.FirstName} {c.User.Volunteer.LastName}".Trim()
                        : (c.User.Organization?.OrgName
                            ?? c.User.Organization?.CompanyName
                            ?? "Okänd"),
                    authorImageUrl = c.User.Volunteer?.ProfileImageUrl
                        ?? c.User.Organization?.ProfileImageUrl,
                    authorType = c.User.Volunteer != null ? "Volunteer" : "Organization",
                    parentCommentId = c.ParentCommentId,
                    likeCount = likeCounts.TryGetValue(c.Id, out var lc) ? lc : 0,
                    likedByMe = likedByMe.Contains(c.Id),
                    replies = c.Replies
                        .OrderBy(r => r.CreatedAt)
                        .Select(r => new
                        {
                            id = r.Id,
                            content = r.Content,
                            createdAt = r.CreatedAt,
                            userId = r.UserId,
                            authorName = r.User.Volunteer != null
                                ? $"{r.User.Volunteer.FirstName} {r.User.Volunteer.LastName}".Trim()
                                : (r.User.Organization?.OrgName
                                    ?? r.User.Organization?.CompanyName
                                    ?? "Okänd"),
                            authorImageUrl = r.User.Volunteer?.ProfileImageUrl
                                ?? r.User.Organization?.ProfileImageUrl,
                            authorType = r.User.Volunteer != null ? "Volunteer" : "Organization",
                            parentCommentId = r.ParentCommentId,
                            likeCount = likeCounts.TryGetValue(r.Id, out var rlc) ? rlc : 0,
                            likedByMe = likedByMe.Contains(r.Id)
                        })
                        .ToList<object>()
                };

                return Results.Ok(comments.Select(MapComment));
            });

            // lägg kommentar eller svara
            app.MapPost("/jobs/{id}/comments", async (
                int id,
                CreateCommentDto dto,
                VoluntiDbContext db,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                if (string.IsNullOrWhiteSpace(dto.Content))
                    return Results.BadRequest("Kommentaren får inte vara tom.");

                if (dto.Content.Length > 1000)
                    return Results.BadRequest("Kommentaren är för lång (max 1000 tecken).");

                var job = await db.Jobs.FindAsync(id);
                if (job == null) return Results.NotFound("Jobbet hittades inte.");

                int? actualParentId = dto.ParentCommentId;
                if (actualParentId.HasValue)
                {
                    var parent = await db.JobComments.FindAsync(actualParentId.Value);
                    if (parent == null || parent.JobId != id)
                        return Results.BadRequest("Ogiltig parent-kommentar.");

                    if (parent.ParentCommentId.HasValue)
                        actualParentId = parent.ParentCommentId;
                }

                var comment = new JobComment
                {
                    JobId = id,
                    UserId = userId,
                    Content = dto.Content.Trim(),
                    ParentCommentId = actualParentId,
                    CreatedAt = DateTime.UtcNow
                };

                db.JobComments.Add(comment);
                await db.SaveChangesAsync();

                var saved = await db.JobComments
                    .Include(c => c.User)
                        .ThenInclude(u => u.Volunteer)
                    .Include(c => c.User)
                        .ThenInclude(u => u.Organization)
                    .FirstAsync(c => c.Id == comment.Id);

                return Results.Ok(new
                {
                    id = saved.Id,
                    content = saved.Content,
                    createdAt = saved.CreatedAt,
                    userId = saved.UserId,
                    authorName = saved.User.Volunteer != null
                        ? $"{saved.User.Volunteer.FirstName} {saved.User.Volunteer.LastName}".Trim()
                        : (saved.User.Organization?.OrgName
                            ?? saved.User.Organization?.CompanyName
                            ?? "Okänd"),
                    authorImageUrl = saved.User.Volunteer?.ProfileImageUrl
                        ?? saved.User.Organization?.ProfileImageUrl,
                    authorType = saved.User.Volunteer != null ? "Volunteer" : "Organization",
                    parentCommentId = saved.ParentCommentId,
                    likeCount = 0,
                    likedByMe = false,
                    replies = new List<object>()
                });
            })
            .RequireAuthorization()
            .RequireRateLimiting("write");

            app.MapDelete("/jobs/{jobId}/comments/{commentId}", async (
                int jobId,
                int commentId,
                VoluntiDbContext db,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var comment = await db.JobComments
                    .Include(c => c.Replies)
                    .FirstOrDefaultAsync(c => c.Id == commentId && c.JobId == jobId);

                if (comment == null) return Results.NotFound();

                if (comment.UserId != userId)
                    return Results.Forbid();

                if (comment.Replies.Any())
                    db.JobComments.RemoveRange(comment.Replies);

                db.JobComments.Remove(comment);
                await db.SaveChangesAsync();

                return Results.Ok();
            })
            .RequireAuthorization();

            /* ==========================================================================
            COMMENT LIKES
            ========================================================================== */

            // toggla like på kommentar
            app.MapPost("/comments/{id}/like", async (
                int id,
                VoluntiDbContext db,
                HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var comment = await db.JobComments.FindAsync(id);
                if (comment == null) return Results.NotFound("Kommentaren hittades inte.");

                var existing = await db.JobCommentLikes
                    .FirstOrDefaultAsync(cl => cl.CommentId == id && cl.UserId == userId);

                bool liked;
                if (existing != null)
                {
                    db.JobCommentLikes.Remove(existing);
                    liked = false;
                }
                else
                {
                    db.JobCommentLikes.Add(new JobCommentLike
                    {
                        CommentId = id,
                        UserId = userId
                    });
                    liked = true;
                }

                await db.SaveChangesAsync();

                var count = await db.JobCommentLikes.CountAsync(cl => cl.CommentId == id);

                return Results.Ok(new { liked, count });
            })
            .RequireAuthorization();
        }

        public record CreateCommentDto(string Content, int? ParentCommentId);
    }
}