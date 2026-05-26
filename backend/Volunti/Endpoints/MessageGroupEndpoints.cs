using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Volunti.Data;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class MessageGroupEndpoints
    {
        private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private static readonly string[] AllowedFileExtensions = { ".pdf", ".jpg", ".jpeg", ".png", ".webp", ".doc", ".docx" };
        private const long MaxAttachmentSize = 10 * 1024 * 1024; 

        public static void RegisterEndpoints(WebApplication app)
        {
            /* ==========================================================================
               GROUPS
               ========================================================================== */

            // alla grupper användaren är medlem i
            app.MapGet("/groups", async (
                ClaimsPrincipal claims,
                VoluntiDbContext db) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var groups = await db.MessageGroupMembers
                    .Where(m => m.UserId == userId)
                    .Include(m => m.MessageGroup)
                        .ThenInclude(g => g.Organization)
                    .Select(m => new
                    {
                        id = m.MessageGroup.Id,
                        name = m.MessageGroup.Name,
                        description = m.MessageGroup.Description,
                        imageUrl = m.MessageGroup.ImageUrl,
                        organizationId = m.MessageGroup.OrganizationId,
                        organizationName = m.MessageGroup.Organization.OrgName ?? m.MessageGroup.Organization.CompanyName,
                        myRole = m.Role.ToString(),
                        lastReadAt = m.LastReadAt,
                        memberCount = m.MessageGroup.Members.Count(),
                        lastMessage = m.MessageGroup.Messages
                            .OrderByDescending(msg => msg.CreatedAt)
                            .Select(msg => new
                            {
                                content = msg.Content,
                                createdAt = msg.CreatedAt,
                                hasAttachments = msg.Attachments.Any()
                            })
                            .FirstOrDefault(),
                        unreadCount = m.MessageGroup.Messages
                            .Count(msg => msg.CreatedAt > m.LastReadAt && msg.SenderUserId != userId)
                    })
                    .OrderByDescending(g => g.lastMessage != null ? g.lastMessage.createdAt : DateTime.MinValue)
                    .ToListAsync();

                return Results.Ok(groups);
            })
            .RequireAuthorization();

            /* ==========================================================================
               GROUP DETAILS
               ========================================================================== */

            app.MapGet("/groups/{id}", async (
                int id,
                ClaimsPrincipal claims,
                VoluntiDbContext db) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userId);
                if (membership == null) return Results.Forbid();

                var group = await db.MessageGroups
                    .Include(g => g.Organization)
                    .Include(g => g.Members).ThenInclude(m => m.User).ThenInclude(u => u.Volunteer)
                    .Include(g => g.Members).ThenInclude(m => m.User).ThenInclude(u => u.Organization)
                    .FirstOrDefaultAsync(g => g.Id == id);

                if (group == null) return Results.NotFound();

                return Results.Ok(new
                {
                    id = group.Id,
                    name = group.Name,
                    description = group.Description,
                    imageUrl = group.ImageUrl,
                    organizationId = group.OrganizationId,
                    organizationName = group.Organization.OrgName ?? group.Organization.CompanyName,
                    myRole = membership.Role.ToString(),
                    members = group.Members.Select(m => new
                    {
                        userId = m.UserId,
                        name = m.User.Volunteer != null
                            ? $"{m.User.Volunteer.FirstName} {m.User.Volunteer.LastName}".Trim()
                            : (m.User.Organization?.OrgName ?? m.User.Organization?.CompanyName ?? "Okänd"),
                        imageUrl = m.User.Volunteer?.ProfileImageUrl ?? m.User.Organization?.ProfileImageUrl,
                        role = m.Role.ToString(),
                        joinedAt = m.JoinedAt
                    })
                });
            })
            .RequireAuthorization();

            /* ==========================================================================
               CREATE GROUP 
               ========================================================================== */

            app.MapPost("/groups", async (
                CreateGroupDto dto,
                ClaimsPrincipal claims,
                VoluntiDbContext db) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                if (string.IsNullOrWhiteSpace(dto.Name))
                    return Results.BadRequest("Gruppens namn krävs.");

                if (dto.Name.Length > 100)
                    return Results.BadRequest("Gruppens namn får vara max 100 tecken.");

                // Hitta organisationen 
                var organization = await db.Organizations
                    .FirstOrDefaultAsync(o => o.UserId == userId);

                if (organization == null)
                {
                    var orgMember = await db.OrganizationMembers
                        .Include(m => m.Organization)
                        .FirstOrDefaultAsync(m => m.UserId == userId);
                    organization = orgMember?.Organization;
                }

                if (organization == null)
                    return Results.BadRequest("Endast organisationer kan skapa grupper.");

                var group = new MessageGroup
                {
                    Name = dto.Name.Trim(),
                    Description = dto.Description?.Trim(),
                    OrganizationId = organization.OrganizationId,
                    CreatedByUserId = userId.Value,
                    CreatedAt = DateTime.UtcNow
                };

                db.MessageGroups.Add(group);
                await db.SaveChangesAsync();

                // Lägg till skaparen som admin
                db.MessageGroupMembers.Add(new MessageGroupMember
                {
                    MessageGroupId = group.Id,
                    UserId = userId.Value,
                    Role = GroupMemberRole.Admin
                });

                await db.SaveChangesAsync();

                return Results.Created($"/groups/{group.Id}", new { id = group.Id });
            })
            .RequireAuthorization(policy => policy.RequireRole("OrgAdmin", "OrgUser"));

            /* ==========================================================================
               UPDATE GROUP
               ========================================================================== */

            app.MapPut("/groups/{id}", async (
                int id,
                UpdateGroupDto dto,
                ClaimsPrincipal claims,
                VoluntiDbContext db) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userId);

                if (membership == null || membership.Role != GroupMemberRole.Admin)
                    return Results.Forbid();

                var group = await db.MessageGroups.FindAsync(id);
                if (group == null) return Results.NotFound();

                if (!string.IsNullOrWhiteSpace(dto.Name))
                    group.Name = dto.Name.Trim();
                if (dto.Description != null)
                    group.Description = dto.Description.Trim();

                await db.SaveChangesAsync();
                return Results.Ok();
            })
            .RequireAuthorization();

            /* ==========================================================================
               DELETE GROUP
               ========================================================================== */

            app.MapDelete("/groups/{id}", async (
                int id,
                ClaimsPrincipal claims,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userId);

                if (membership == null || membership.Role != GroupMemberRole.Admin)
                    return Results.Forbid();

                var group = await db.MessageGroups
                    .Include(g => g.Messages).ThenInclude(m => m.Attachments)
                    .FirstOrDefaultAsync(g => g.Id == id);

                if (group == null) return Results.NotFound();

                // Ta bort bilagor på disk
                var groupFolder = Path.Combine(env.ContentRootPath, "uploads", "groups", id.ToString());
                if (Directory.Exists(groupFolder))
                    Directory.Delete(groupFolder, true);

                db.MessageGroups.Remove(group);
                await db.SaveChangesAsync();
                return Results.Ok();
            })
            .RequireAuthorization();
            

            /* ==========================================================================
            SEARCH USERS för att lägga till i grupp
            ========================================================================== */

            app.MapGet("/groups/{id}/search-users", async (
                int id,
                string? q,
                ClaimsPrincipal claims,
                VoluntiDbContext db) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userId);
                if (membership == null || membership.Role != GroupMemberRole.Admin)
                    return Results.Forbid();

                if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
                    return Results.Ok(Array.Empty<object>());

                var query = q.Trim().ToLower();

                var existingMemberIds = await db.MessageGroupMembers
                    .Where(m => m.MessageGroupId == id)
                    .Select(m => m.UserId)
                    .ToListAsync();

                var users = await db.Users
                    .Where(u => !existingMemberIds.Contains(u.Id))
                    .Include(u => u.Volunteer)
                    .Include(u => u.Organization)
                    .Where(u =>
                        u.Email!.ToLower().Contains(query) ||
                        (u.Volunteer != null && (
                            u.Volunteer.FirstName.ToLower().Contains(query) ||
                            u.Volunteer.LastName.ToLower().Contains(query)
                        )) ||
                        (u.Organization != null && (
                            u.Organization.OrgName.ToLower().Contains(query) ||
                            u.Organization.CompanyName.ToLower().Contains(query)
                        ))
                    )
                    .Take(10)
                    .Select(u => new
                    {
                        userId = u.Id,
                        email = u.Email,
                        name = u.Volunteer != null
                            ? $"{u.Volunteer.FirstName} {u.Volunteer.LastName}".Trim()
                            : (u.Organization != null
                                ? (u.Organization.OrgName ?? u.Organization.CompanyName)
                                : u.UserName),
                        imageUrl = u.Volunteer != null
                            ? u.Volunteer.ProfileImageUrl
                            : (u.Organization != null ? u.Organization.ProfileImageUrl : null),
                        type = u.Volunteer != null ? "Volunteer" : (u.Organization != null ? "Organization" : "Other")
                    })
                    .ToListAsync();

                return Results.Ok(users);
            })
            .RequireAuthorization();

            /* ==========================================================================
               MEMBERS lägg till
               ========================================================================== */

            app.MapPost("/groups/{id}/members", async (
                int id,
                AddMemberDto dto,
                ClaimsPrincipal claims,
                VoluntiDbContext db) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userId);

                if (membership == null || membership.Role != GroupMemberRole.Admin)
                    return Results.Forbid();

                if (await db.MessageGroupMembers.AnyAsync(m => m.MessageGroupId == id && m.UserId == dto.UserId))
                    return Results.Conflict(new { detail = "Användaren är redan medlem i gruppen." });

                var targetUser = await db.Users.FindAsync(dto.UserId);
                if (targetUser == null) return Results.NotFound("Användaren hittades inte.");

                db.MessageGroupMembers.Add(new MessageGroupMember
                {
                    MessageGroupId = id,
                    UserId = dto.UserId,
                    Role = GroupMemberRole.Member
                });
                await db.SaveChangesAsync();
                return Results.Ok();
            })
            .RequireAuthorization();

            /* ==========================================================================
               MEMBERS  TA BORT
               ========================================================================== */

            app.MapDelete("/groups/{id}/members/{userIdToRemove}", async (
                int id,
                int userIdToRemove,
                ClaimsPrincipal claims,
                VoluntiDbContext db) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var myMembership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userId);
                if (myMembership == null) return Results.Forbid();

                if (myMembership.Role != GroupMemberRole.Admin && userIdToRemove != userId)
                    return Results.Forbid();

                var target = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userIdToRemove);
                if (target == null) return Results.NotFound();

                db.MessageGroupMembers.Remove(target);
                await db.SaveChangesAsync();
                return Results.Ok();
            })
            .RequireAuthorization();

            /* ==========================================================================
               MESSAGES
               ========================================================================== */

            app.MapGet("/groups/{id}/messages", async (
                int id,
                ClaimsPrincipal claims,
                VoluntiDbContext db,
                int? before = null,
                int limit = 50) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userId);
                if (membership == null) return Results.Forbid();

                if (limit < 1 || limit > 100) limit = 50;

                var query = db.GroupMessages
                    .Where(m => m.MessageGroupId == id)
                    .Include(m => m.SenderUser).ThenInclude(u => u.Volunteer)
                    .Include(m => m.SenderUser).ThenInclude(u => u.Organization)
                    .Include(m => m.Attachments)
                    .AsQueryable();

                if (before.HasValue)
                    query = query.Where(m => m.Id < before.Value);

                var messages = await query
                    .OrderByDescending(m => m.CreatedAt)
                    .Take(limit)
                    .ToListAsync();

                // Vänd så de visas i ordning
                messages.Reverse();

                return Results.Ok(messages.Select(m => new
                {
                    id = m.Id,
                    content = m.Content,
                    createdAt = m.CreatedAt,
                    senderUserId = m.SenderUserId,
                    senderName = m.SenderUser.Volunteer != null
                        ? $"{m.SenderUser.Volunteer.FirstName} {m.SenderUser.Volunteer.LastName}".Trim()
                        : (m.SenderUser.Organization?.OrgName ?? m.SenderUser.Organization?.CompanyName ?? "Okänd"),
                    senderImageUrl = m.SenderUser.Volunteer?.ProfileImageUrl ?? m.SenderUser.Organization?.ProfileImageUrl,
                    senderType = m.SenderUser.Volunteer != null ? "Volunteer" : "Organization",
                    isMine = m.SenderUserId == userId,
                    attachments = m.Attachments.Select(a => new
                    {
                        id = a.Id,
                        originalFileName = a.OriginalFileName,
                        contentType = a.ContentType,
                        fileSizeBytes = a.FileSizeBytes,
                        isImage = a.IsImage,
                        downloadUrl = $"/groups/{id}/attachments/{a.Id}"
                    })
                }));
            })
            .RequireAuthorization();

            /* ==========================================================================
               MESSAGES SKICKA
               ========================================================================== */

            app.MapPost("/groups/{id}/messages", async (
                int id,
                HttpRequest request,
                ClaimsPrincipal claims,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userId);
                if (membership == null) return Results.Forbid();

                string? content = null;
                List<IFormFile> files = new();

                if (request.HasFormContentType)
                {
                    var form = await request.ReadFormAsync();
                    content = form["content"].ToString();
                    files = form.Files.Where(f => f.Name == "files").ToList();
                }
                else
                {
                    var body = await request.ReadFromJsonAsync<SendMessageDto>();
                    content = body?.Content;
                }

                if (string.IsNullOrWhiteSpace(content) && files.Count == 0)
                    return Results.BadRequest("Meddelandet får inte vara tomt.");

                if (content?.Length > 4000)
                    return Results.BadRequest("Meddelandet är för långt (max 4000 tecken).");

                var message = new GroupMessage
                {
                    MessageGroupId = id,
                    SenderUserId = userId.Value,
                    Content = string.IsNullOrWhiteSpace(content) ? null : content.Trim(),
                    CreatedAt = DateTime.UtcNow
                };

                db.GroupMessages.Add(message);
                await db.SaveChangesAsync();

                // Hantera bilagor
                if (files.Count > 0)
                {
                    var groupFolder = Path.Combine(env.ContentRootPath, "uploads", "groups", id.ToString());
                    Directory.CreateDirectory(groupFolder);

                    foreach (var file in files)
                    {
                        if (file.Length == 0 || file.Length > MaxAttachmentSize) continue;

                        var ext = Path.GetExtension(file.FileName).ToLower();
                        if (!AllowedFileExtensions.Contains(ext)) continue;

                        var storedName = $"{Guid.NewGuid()}{ext}";
                        var fullPath = Path.Combine(groupFolder, storedName);

                        using var stream = new FileStream(fullPath, FileMode.Create);
                        await file.CopyToAsync(stream);

                        db.GroupMessageAttachments.Add(new GroupMessageAttachment
                        {
                            GroupMessageId = message.Id,
                            OriginalFileName = file.FileName,
                            StoredFileName = storedName,
                            ContentType = file.ContentType,
                            FileSizeBytes = file.Length,
                            IsImage = AllowedImageExtensions.Contains(ext)
                        });
                    }

                    await db.SaveChangesAsync();
                }

                // Markera meddelandet som läst för avsändaren
                membership.LastReadAt = message.CreatedAt;
                await db.SaveChangesAsync();

                var saved = await db.GroupMessages
                    .Include(m => m.SenderUser).ThenInclude(u => u.Volunteer)
                    .Include(m => m.SenderUser).ThenInclude(u => u.Organization)
                    .Include(m => m.Attachments)
                    .FirstAsync(m => m.Id == message.Id);

                return Results.Ok(new
                {
                    id = saved.Id,
                    content = saved.Content,
                    createdAt = saved.CreatedAt,
                    senderUserId = saved.SenderUserId,
                    senderName = saved.SenderUser.Volunteer != null
                        ? $"{saved.SenderUser.Volunteer.FirstName} {saved.SenderUser.Volunteer.LastName}".Trim()
                        : (saved.SenderUser.Organization?.OrgName ?? saved.SenderUser.Organization?.CompanyName ?? "Okänd"),
                    senderImageUrl = saved.SenderUser.Volunteer?.ProfileImageUrl ?? saved.SenderUser.Organization?.ProfileImageUrl,
                    senderType = saved.SenderUser.Volunteer != null ? "Volunteer" : "Organization",
                    isMine = true,
                    attachments = saved.Attachments.Select(a => new
                    {
                        id = a.Id,
                        originalFileName = a.OriginalFileName,
                        contentType = a.ContentType,
                        fileSizeBytes = a.FileSizeBytes,
                        isImage = a.IsImage,
                        downloadUrl = $"/groups/{id}/attachments/{a.Id}"
                    })
                });
            })
            .RequireAuthorization()
            .RequireRateLimiting("write")
            .DisableAntiforgery();

            /* ==========================================================================
               MESSAGES DELETE (egna)
               ========================================================================== */

            app.MapDelete("/groups/{groupId}/messages/{messageId}", async (
                int groupId,
                int messageId,
                ClaimsPrincipal claims,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var message = await db.GroupMessages
                    .Include(m => m.Attachments)
                    .FirstOrDefaultAsync(m => m.Id == messageId && m.MessageGroupId == groupId);

                if (message == null) return Results.NotFound();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == groupId && m.UserId == userId);
                if (membership == null) return Results.Forbid();

                // Bara avsändaren eller Admin kan ta bort
                if (message.SenderUserId != userId && membership.Role != GroupMemberRole.Admin)
                    return Results.Forbid();

                // Ta bort bilagor 
                var groupFolder = Path.Combine(env.ContentRootPath, "uploads", "groups", groupId.ToString());
                foreach (var att in message.Attachments)
                {
                    var path = Path.Combine(groupFolder, att.StoredFileName);
                    if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
                }

                db.GroupMessages.Remove(message);
                await db.SaveChangesAsync();
                return Results.Ok();
            })
            .RequireAuthorization();

            /* ==========================================================================
               ATTACHMENT DOWNLOAD
               ========================================================================== */

            app.MapGet("/groups/{groupId}/attachments/{attachmentId}", async (
                int groupId,
                int attachmentId,
                ClaimsPrincipal claims,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == groupId && m.UserId == userId);
                if (membership == null) return Results.Forbid();

                var attachment = await db.GroupMessageAttachments
                    .Include(a => a.GroupMessage)
                    .FirstOrDefaultAsync(a => a.Id == attachmentId && a.GroupMessage.MessageGroupId == groupId);

                if (attachment == null) return Results.NotFound();

                var fullPath = Path.Combine(env.ContentRootPath, "uploads", "groups", groupId.ToString(), attachment.StoredFileName);
                if (!System.IO.File.Exists(fullPath))
                    return Results.NotFound("Filen saknas på disk.");

                var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
                return Results.File(stream, attachment.ContentType, attachment.OriginalFileName);
            })
            .RequireAuthorization();

            /* ==========================================================================
               MARK READ
               ========================================================================== */

            app.MapPost("/groups/{id}/read", async (
                int id,
                ClaimsPrincipal claims,
                VoluntiDbContext db) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var membership = await db.MessageGroupMembers
                    .FirstOrDefaultAsync(m => m.MessageGroupId == id && m.UserId == userId);
                if (membership == null) return Results.Forbid();

                membership.LastReadAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
                return Results.Ok();
            })
            .RequireAuthorization();

            /* ==========================================================================
               UNREAD COUNT 
               ========================================================================== */

            app.MapGet("/groups/unread-count", async (
                ClaimsPrincipal claims,
                VoluntiDbContext db) =>
            {
                var userId = GetUserId(claims);
                if (userId is null) return Results.Unauthorized();

                var unread = await db.MessageGroupMembers
                    .Where(m => m.UserId == userId)
                    .Select(m => m.MessageGroup.Messages
                        .Count(msg => msg.CreatedAt > m.LastReadAt && msg.SenderUserId != userId))
                    .ToListAsync();

                return Results.Ok(new { count = unread.Sum() });
            })
            .RequireAuthorization();
        }

        private static int? GetUserId(ClaimsPrincipal claims)
        {
            var claim = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : (int?)null;
        }

        public record CreateGroupDto(string Name, string? Description);
        public record UpdateGroupDto(string? Name, string? Description);
        public record AddMemberDto(int UserId);
        public record SendMessageDto(string? Content);
    }
}