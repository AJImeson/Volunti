using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class FileEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            /* ==========================================================================
               UPLOAD
               ========================================================================== */
            app.MapPost("/me/files/upload", async (
                HttpRequest request,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IFileService fileService,
                IWebHostEnvironment env) =>
            {
                if (!request.HasFormContentType)
                    return Results.BadRequest(new { detail = "Förväntade multipart/form-data." });

                var form = await request.ReadFormAsync();
                var file = form.Files.GetFile("file");
                var category = form["category"].ToString().ToLower();
                var title = form["title"].ToString();
                var experienceIdStr = form["experienceId"].ToString();

                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, result, error) = await fileService.UploadFileAsync(file!, category, title, experienceIdStr, userId, env.ContentRootPath);
                if (!success)
                    return error == "NotFound" ? Results.NotFound() : Results.BadRequest(new { detail = error });
                return Results.Ok(result);
            }).RequireAuthorization()
              .DisableAntiforgery();

            /* ==========================================================================
               LIST FILES
               ========================================================================== */
            app.MapGet("/me/files", async (
                string? category,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IFileService fileService) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, files, error) = await fileService.GetFilesAsync(userId, category);
                if (!success) return Results.NotFound();
                return Results.Ok(files);
            }).RequireAuthorization();

            /* ==========================================================================
               DOWNLOAD FILE
               ========================================================================== */
            app.MapGet("/me/files/{fileId}/download", async (
                int fileId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IFileService fileService,
                IWebHostEnvironment env) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, stream, contentType, fileName, error) = await fileService.DownloadFileAsync(fileId, userId, env.ContentRootPath);
                if (!success) return Results.NotFound();
                return Results.File(stream!, contentType!, fileName!);
            }).RequireAuthorization();

            /* ==========================================================================
               DELETE FILE
               ========================================================================== */
            app.MapDelete("/me/files/{fileId}", async (
                int fileId,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IFileService fileService,
                IWebHostEnvironment env) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, error) = await fileService.DeleteFileAsync(fileId, userId, env.ContentRootPath);
                if (!success) return Results.NotFound();
                return Results.Ok();
            }).RequireAuthorization();

            /* ==========================================================================
               PROFILBILD
               ========================================================================== */
            app.MapPost("/me/profile-image", async (
                HttpRequest request,
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IFileService fileService,
                IWebHostEnvironment env) =>
            {
                if (!request.HasFormContentType)
                    return Results.BadRequest(new { detail = "Förväntade multipart/form-data." });

                var form = await request.ReadFormAsync();
                var file = form.Files.GetFile("file");

                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, result, error) = await fileService.UploadProfileImageAsync(file!, userId, env.ContentRootPath);
                if (!success)
                    return error == "NotFound" ? Results.NotFound() : Results.BadRequest(new { detail = error });
                return Results.Ok(result);
            }).RequireAuthorization()
            .DisableAntiforgery();

            app.MapDelete("/me/profile-image", async (
                ClaimsPrincipal claims,
                UserManager<AppUser> userManager,
                IFileService fileService,
                IWebHostEnvironment env) =>
            {
                var userIdStr = userManager.GetUserId(claims);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var (success, error) = await fileService.DeleteProfileImageAsync(userId, env.ContentRootPath);
                if (!success) return Results.NotFound();
                return Results.Ok();
            }).RequireAuthorization();
        }
    }
}
