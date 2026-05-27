namespace Volunti.Interfaces
{
    public interface IFileService
    {
        Task<(bool success, object? result, string? error)> UploadFileAsync(IFormFile file, string category, string title, string? experienceIdStr, int userId, string contentRootPath);
        Task<(bool success, object? files, string? error)> GetFilesAsync(int userId, string? category);
        Task<(bool success, Stream? stream, string? contentType, string? fileName, string? error)> DownloadFileAsync(int fileId, int userId, string contentRootPath);
        Task<(bool success, string? error)> DeleteFileAsync(int fileId, int userId, string contentRootPath);
        Task<(bool success, object? result, string? error)> UploadProfileImageAsync(IFormFile file, int userId, string contentRootPath);
        Task<(bool success, string? error)> DeleteProfileImageAsync(int userId, string contentRootPath);
    }
}
