using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Service
{
    public class FileService(IFileRepository fileRepo) : IFileService
    {
        private static readonly string[] AllowedExtensions = { ".pdf", ".jpg", ".jpeg", ".png" };
        private static readonly string[] AllowedCategories = { "cv", "certificate", "experience-attachment" };
        private const long MaxFileSizeBytes = 5 * 1024 * 1024;

        public async Task<(bool success, object? result, string? error)> UploadFileAsync(
            IFormFile file, string category, string title, string? experienceIdStr, int userId, string contentRootPath)
        {
            if (!AllowedCategories.Contains(category))
                return (false, null, "Ogiltig kategori.");

            if (file == null || file.Length == 0)
                return (false, null, "Ingen fil mottagen.");

            if (file.Length > MaxFileSizeBytes)
                return (false, null, "Filen är för stor (max 5 MB).");

            var ext = Path.GetExtension(file.FileName).ToLower();
            if (!AllowedExtensions.Contains(ext))
                return (false, null, "Endast PDF, JPG och PNG är tillåtna.");

            var volunteer = await fileRepo.GetVolunteerByUserIdAsync(userId);
            if (volunteer is null) return (false, null, "NotFound");

            if (category == "cv")
            {
                var existingCv = await fileRepo.GetCvFilesAsync(volunteer.Id);
                foreach (var oldCv in existingCv)
                {
                    var oldPath = GetFilePath(contentRootPath, volunteer.Id, oldCv.StoredFileName);
                    if (File.Exists(oldPath)) File.Delete(oldPath);
                    await fileRepo.RemoveFileAsync(oldCv);
                }
            }

            var storedFileName = $"{Guid.NewGuid()}{ext}";
            var userFolder = Path.Combine(contentRootPath, "uploads", volunteer.Id.ToString());
            Directory.CreateDirectory(userFolder);

            var fullPath = Path.Combine(userFolder, storedFileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

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

            await fileRepo.AddFileAsync(fileEntity);
            await fileRepo.SaveChangesAsync();

            return (true, new
            {
                id = fileEntity.Id,
                category = fileEntity.Category,
                title = fileEntity.Title,
                originalFileName = fileEntity.OriginalFileName,
                contentType = fileEntity.ContentType,
                fileSizeBytes = fileEntity.FileSizeBytes,
                uploadedAt = fileEntity.UploadedAt
            }, null);
        }

        public async Task<(bool success, object? files, string? error)> GetFilesAsync(int userId, string? category)
        {
            var volunteer = await fileRepo.GetVolunteerByUserIdAsync(userId);
            if (volunteer is null) return (false, null, "NotFound");

            var files = await fileRepo.GetFilesByVolunteerIdAsync(volunteer.Id, category);
            var result = files.Select(f => (object)new
            {
                id = f.Id,
                category = f.Category,
                title = f.Title,
                originalFileName = f.OriginalFileName,
                contentType = f.ContentType,
                fileSizeBytes = f.FileSizeBytes,
                uploadedAt = f.UploadedAt,
                experienceId = f.ExperienceId
            });

            return (true, result, null);
        }

        public async Task<(bool success, Stream? stream, string? contentType, string? fileName, string? error)> DownloadFileAsync(
            int fileId, int userId, string contentRootPath)
        {
            var volunteer = await fileRepo.GetVolunteerByUserIdAsync(userId);
            if (volunteer is null) return (false, null, null, null, "NotFound");

            var fileEntity = await fileRepo.GetFileByIdAsync(fileId, volunteer.Id);
            if (fileEntity is null) return (false, null, null, null, "NotFound");

            var fullPath = GetFilePath(contentRootPath, volunteer.Id, fileEntity.StoredFileName);
            if (!File.Exists(fullPath))
                return (false, null, null, null, "Filen saknas på disk.");

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return (true, stream, fileEntity.ContentType, fileEntity.OriginalFileName, null);
        }

        public async Task<(bool success, string? error)> DeleteFileAsync(int fileId, int userId, string contentRootPath)
        {
            var volunteer = await fileRepo.GetVolunteerByUserIdAsync(userId);
            if (volunteer is null) return (false, "NotFound");

            var fileEntity = await fileRepo.GetFileByIdAsync(fileId, volunteer.Id);
            if (fileEntity is null) return (false, "NotFound");

            var fullPath = GetFilePath(contentRootPath, volunteer.Id, fileEntity.StoredFileName);
            if (File.Exists(fullPath)) File.Delete(fullPath);

            await fileRepo.RemoveFileAsync(fileEntity);
            await fileRepo.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, object? result, string? error)> UploadProfileImageAsync(
            IFormFile file, int userId, string contentRootPath)
        {
            if (file == null || file.Length == 0)
                return (false, null, "Ingen fil mottagen.");

            if (file.Length > MaxFileSizeBytes)
                return (false, null, "Filen är för stor (max 5 MB).");

            var ext = Path.GetExtension(file.FileName).ToLower();
            if (ext != ".jpg" && ext != ".jpeg" && ext != ".png")
                return (false, null, "Endast JPG och PNG är tillåtna.");

            var volunteer = await fileRepo.GetVolunteerByUserIdAsync(userId);
            if (volunteer is null) return (false, null, "NotFound");

            var publicFolder = Path.Combine(contentRootPath, "wwwroot", "profile-images");
            Directory.CreateDirectory(publicFolder);

            if (!string.IsNullOrEmpty(volunteer.ProfileImageUrl))
            {
                var oldFileName = Path.GetFileName(volunteer.ProfileImageUrl);
                var oldPath = Path.Combine(publicFolder, oldFileName);
                if (File.Exists(oldPath)) File.Delete(oldPath);
            }

            var newFileName = $"profile-{volunteer.Id}-{Guid.NewGuid()}{ext}";
            var fullPath = Path.Combine(publicFolder, newFileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var publicUrl = $"/profile-images/{newFileName}";
            volunteer.ProfileImageUrl = publicUrl;
            await fileRepo.SaveChangesAsync();

            return (true, new { profileImageUrl = publicUrl }, null);
        }

        public async Task<(bool success, string? error)> DeleteProfileImageAsync(int userId, string contentRootPath)
        {
            var volunteer = await fileRepo.GetVolunteerByUserIdAsync(userId);
            if (volunteer is null) return (false, "NotFound");

            if (!string.IsNullOrEmpty(volunteer.ProfileImageUrl))
            {
                var fileName = Path.GetFileName(volunteer.ProfileImageUrl);
                var fullPath = Path.Combine(contentRootPath, "wwwroot", "profile-images", fileName);
                if (File.Exists(fullPath)) File.Delete(fullPath);
            }

            volunteer.ProfileImageUrl = string.Empty;
            await fileRepo.SaveChangesAsync();
            return (true, null);
        }

        private static string GetFilePath(string contentRootPath, int volunteerId, string storedFileName) =>
            Path.Combine(contentRootPath, "uploads", volunteerId.ToString(), storedFileName);
    }
}
