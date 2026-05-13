using Microsoft.AspNetCore.Identity;
using Volunti.Dtos.Organization;
using Volunti.Interfaces;
using Volunti.Models;

namespace Volunti.Service
{
    public class OrganizationService(
        IOrganizationRepository orgRepo,
        UserManager<AppUser> userManager) : IOrganizationService
    {
        public Task<List<Organization>> GetAllAsync() => orgRepo.GetAllAsync();

        public Task<Organization?> GetByIdAsync(int id) => orgRepo.GetByIdAsync(id);

        public async Task<(bool success, string? newUserEmail, int? orgId, string? error)> AddMemberAsync(CreateOrgMemberDto dto, int adminUserId)
        {
            var org = await orgRepo.GetByUserIdAsync(adminUserId);
            if (org is null)
                return (false, null, null, "Forbidden");

            var newUser = new AppUser { UserName = dto.Email.ToLower(), Email = dto.Email.ToLower() };
            var createdUser = await userManager.CreateAsync(newUser, dto.Password!);
            if (!createdUser.Succeeded)
                return (false, null, null, string.Join(", ", createdUser.Errors.Select(e => e.Description)));

            var roleResult = await userManager.AddToRoleAsync(newUser, "OrgUser");
            if (!roleResult.Succeeded)
                return (false, null, null, string.Join(", ", roleResult.Errors.Select(e => e.Description)));

            await orgRepo.AddMemberAsync(new OrganizationMember
            {
                UserId = newUser.Id,
                OrganizationId = org.OrganizationId,
                CreatedAt = DateTime.UtcNow
            });
            await orgRepo.SaveChangesAsync();
            return (true, newUser.Email, org.OrganizationId, null);
        }

        public async Task<(bool success, string? error)> DeleteAsync(int id, int userId, bool isAdmin)
        {
            var organization = await orgRepo.GetWithJobsAsync(id);
            if (organization == null)
                return (false, "NotFound");

            if (!isAdmin && organization.UserId != userId)
                return (false, "Du har inte behörighet att ta bort denna organization.");

            await orgRepo.RemoveJobsRangeAsync(organization.Jobs);
            await orgRepo.RemoveAsync(organization);
            await orgRepo.SaveChangesAsync();
            return (true, null);
        }
    }
}
