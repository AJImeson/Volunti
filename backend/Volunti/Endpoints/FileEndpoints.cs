using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Volunti.Data;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class FileEndpoints
    {
        private static readonly string[] AllowedExtensions = { ".pdf", ".jpg", ".jpeg", ".png" };
        private static readonly string[] AllowedCategories = { "cv", "certificate", "experience-attachment" };
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; 

        public static void RegisterEndpoints(WebApplication app)
        {
            /* ==========================================================================
               UPLOAD
               ========================================================================== */
            app.MapPost("/me/files/upload", async (
                HttpRequest request,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                if (!request.HasFormContentType)
                    return Results.BadRequest(new { detail = "Förväntade multipart/form-data." });

                var form = await request.ReadFormAsync();
                var file = form.Files.GetFile("file");
                var category = form["category"].ToString().ToLower();
                var title = form["title"].ToString();
                var experienceIdStr = form["experienceId"].ToString();

                // Validera kategori
                if (!AllowedCategories.Contains(category))
                    return Results.BadRequest(new { detail = "Ogiltig kategori." });

                // Validera fil
                if (file == null || file.Length == 0)
                    return Results.BadRequest(new { detail = "Ingen fil mottagen." });

                if (file.Length > MaxFileSizeBytes)
                    return Results.BadRequest(new { detail = "Filen är för stor (max 5 MB)." });

                var ext = Path.GetExtension(file.FileName).ToLower();
                if (!AllowedExtensions.Contains(ext))
                    return Results.BadRequest(new { detail = "Endast PDF, JPG och PNG är tillåtna." });

                // Hitta volontären
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer is null) return Results.NotFound();

                // bara en CV per volontär 
                if (category == "cv")
                {
                    var existingCv = await db.VolunteerFiles
                        .Where(f => f.VolunteerId == volunteer.Id && f.Category == "cv")
                        .ToListAsync();

                    foreach (var oldCv in existingCv)
                    {
                        var oldPath = GetFilePath(env, volunteer.Id, oldCv.StoredFileName);
                        if (System.IO.File.Exists(oldPath))
                            System.IO.File.Delete(oldPath);
                        db.VolunteerFiles.Remove(oldCv);
                    }
                }

                // Spara filen på disk med slumpat namn
                var storedFileName = $"{Guid.NewGuid()}{ext}";
                var userFolder = Path.Combine(env.ContentRootPath, "uploads", volunteer.Id.ToString());
                Directory.CreateDirectory(userFolder);

                var fullPath = Path.Combine(userFolder, storedFileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Spara metadata i databasen
                int? experienceId = null;
                if (int.TryParse(experienceIdStr, out var parsedExpId))
                    experienceId = parsedExpId;

                var fileEntity = new VolunteerFile
                {
                    VolunteerId = volunteer.Id,
                    Category = category,
                    OriginalFileName = file.FileName,
                    StoredFileName = storedFileName,
                    ContentType = file.ContentType,
                    FileSizeBytes = file.Length,
                    Title = title,
                    ExperienceId = experienceId
                };

                db.VolunteerFiles.Add(fileEntity);
                await db.SaveChangesAsync();

                return Results.Ok(new
                {
                    id = fileEntity.Id,
                    category = fileEntity.Category,
                    title = fileEntity.Title,
                    originalFileName = fileEntity.OriginalFileName,
                    contentType = fileEntity.ContentType,
                    fileSizeBytes = fileEntity.FileSizeBytes,
                    uploadedAt = fileEntity.UploadedAt
                });
            }).RequireAuthorization()
              .DisableAntiforgery();

            /* ==========================================================================
               LIST FILES 
               ========================================================================== */
            app.MapGet("/me/files", async (
                string? category,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer is null) return Results.NotFound();

                var query = db.VolunteerFiles.Where(f => f.VolunteerId == volunteer.Id);

                if (!string.IsNullOrWhiteSpace(category))
                    query = query.Where(f => f.Category == category.ToLower());

                var files = await query
                    .OrderByDescending(f => f.UploadedAt)
                    .Select(f => new
                    {
                        id = f.Id,
                        category = f.Category,
                        title = f.Title,
                        originalFileName = f.OriginalFileName,
                        contentType = f.ContentType,
                        fileSizeBytes = f.FileSizeBytes,
                        uploadedAt = f.UploadedAt,
                        experienceId = f.ExperienceId
                    })
                    .ToListAsync();

                return Results.Ok(files);
            }).RequireAuthorization();

            /* ==========================================================================
               DOWNLOAD FILE 
               ========================================================================== */
            app.MapGet("/me/files/{fileId}/download", async (
                int fileId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer is null) return Results.NotFound();

                var fileEntity = await db.VolunteerFiles
                    .FirstOrDefaultAsync(f => f.Id == fileId && f.VolunteerId == volunteer.Id);

                if (fileEntity is null) return Results.NotFound();

                var fullPath = GetFilePath(env, volunteer.Id, fileEntity.StoredFileName);
                if (!System.IO.File.Exists(fullPath))
                    return Results.NotFound("Filen saknas på disk.");

                var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
                return Results.File(stream, fileEntity.ContentType, fileEntity.OriginalFileName);
            }).RequireAuthorization();

            /* ==========================================================================
               DELETE FILE
               ========================================================================== */
            app.MapDelete("/me/files/{fileId}", async (
                int fileId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                if (volunteer is null) return Results.NotFound();

                var fileEntity = await db.VolunteerFiles
                    .FirstOrDefaultAsync(f => f.Id == fileId && f.VolunteerId == volunteer.Id);

                if (fileEntity is null) return Results.NotFound();

                var fullPath = GetFilePath(env, volunteer.Id, fileEntity.StoredFileName);
                if (System.IO.File.Exists(fullPath))
                    System.IO.File.Delete(fullPath);

                db.VolunteerFiles.Remove(fileEntity);
                await db.SaveChangesAsync();
                return Results.Ok();
            }).RequireAuthorization();

            /* ==========================================================================
               PROFILBILD 
               ========================================================================== */
            app.MapPost("/me/profile-image", async (
                HttpRequest request,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                if (!request.HasFormContentType)
                    return Results.BadRequest(new { detail = "Förväntade multipart/form-data." });

                var form = await request.ReadFormAsync();
                var file = form.Files.GetFile("file");

                if (file == null || file.Length == 0)
                    return Results.BadRequest(new { detail = "Ingen fil mottagen." });

                if (file.Length > MaxFileSizeBytes)
                    return Results.BadRequest(new { detail = "Filen är för stor (max 5 MB)." });

                var ext = Path.GetExtension(file.FileName).ToLower();
                if (ext != ".jpg" && ext != ".jpeg" && ext != ".png")
                    return Results.BadRequest(new { detail = "Endast JPG och PNG är tillåtna." });

                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                // Försök hitta volontär eller organisation
                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                var organization = volunteer == null
                    ? await db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId)
                    : null;

                if (volunteer is null && organization is null)
                    return Results.NotFound("Användarprofil hittades inte.");

                // Skapa public mappen
                var publicFolder = Path.Combine(env.ContentRootPath, "wwwroot", "profile-images");
                Directory.CreateDirectory(publicFolder);

                // Ta bort gammal bild
                string? oldImageUrl = volunteer?.ProfileImageUrl ?? organization?.ProfileImageUrl;
                if (!string.IsNullOrEmpty(oldImageUrl))
                {
                    var oldFileName = Path.GetFileName(oldImageUrl);
                    var oldPath = Path.Combine(publicFolder, oldFileName);
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                // Spara nya bilden med prefix för vilken typ
                var prefix = volunteer != null ? $"profile-{volunteer.Id}" : $"org-{organization!.OrganizationId}";
                var newFileName = $"{prefix}-{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(publicFolder, newFileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Spara relativ URL i databasen
                var publicUrl = $"/profile-images/{newFileName}";
                if (volunteer != null)
                    volunteer.ProfileImageUrl = publicUrl;
                else
                    organization!.ProfileImageUrl = publicUrl;

                await db.SaveChangesAsync();

                return Results.Ok(new { profileImageUrl = publicUrl });
            }).RequireAuthorization()
            .DisableAntiforgery();

            app.MapDelete("/me/profile-image", async (
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                VoluntiDbContext db,
                IWebHostEnvironment env) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var volunteer = await db.Volunteers.FirstOrDefaultAsync(v => v.UserId == userId);
                var organization = volunteer == null
                    ? await db.Organizations.FirstOrDefaultAsync(o => o.UserId == userId)
                    : null;

                if (volunteer is null && organization is null)
                    return Results.NotFound();

                string? imageUrl = volunteer?.ProfileImageUrl ?? organization?.ProfileImageUrl;
                if (!string.IsNullOrEmpty(imageUrl))
                {
                    var fileName = Path.GetFileName(imageUrl);
                    var fullPath = Path.Combine(env.ContentRootPath, "wwwroot", "profile-images", fileName);
                    if (System.IO.File.Exists(fullPath))
                        System.IO.File.Delete(fullPath);
                }

                if (volunteer != null)
                    volunteer.ProfileImageUrl = string.Empty;
                else
                    organization!.ProfileImageUrl = string.Empty;

                await db.SaveChangesAsync();
                return Results.Ok();
            }).RequireAuthorization();
        }

        private static string GetFilePath(IWebHostEnvironment env, int volunteerId, string storedFileName)
        {
            return Path.Combine(env.ContentRootPath, "uploads", volunteerId.ToString(), storedFileName);
        }
    }
}