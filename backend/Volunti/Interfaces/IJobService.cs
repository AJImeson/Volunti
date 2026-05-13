using Volunti.DTOs;
using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IJobService
    {
        Task<List<Job>> GetAllAsync();
        Task<(bool success, List<Job>? jobs, string? error)> GetByUserAsync(int userId);
        Task<Job?> GetByIdAsync(int id);
        Task<(bool success, Job? job, string? error)> CreateAsync(CreateJobDto dto, int userId, bool isAdmin);
        Task<(bool success, string? error)> DeleteAsync(int id, int userId, bool isAdmin);
    }
}
