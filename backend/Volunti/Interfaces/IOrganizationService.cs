using Volunti.Dtos.Organization;
using Volunti.Models;

namespace Volunti.Interfaces
{
    public interface IOrganizationService
    {
        Task<List<Organization>> GetAllAsync();
        Task<Organization?> GetByIdAsync(int id);
        Task<(bool success, string? newUserEmail, int? orgId, string? error)> AddMemberAsync(CreateOrgMemberDto dto, int adminUserId);
        Task<(bool success, string? error)> DeleteAsync(int id, int userId, bool isAdmin);
    }
}
