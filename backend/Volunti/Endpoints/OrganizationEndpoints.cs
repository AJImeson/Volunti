using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Volunti.Dtos.Organization;
using Volunti.Interfaces;
using Volunti.Mappers;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class OrganizationEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapGet("/organizations", async (IOrganizationService orgService) =>
            {
                var orgs = await orgService.GetAllAsync();
                return Results.Ok(orgs.Select(o => o.ToOrgDto()));
            });

            app.MapGet("/organizations/{id}", async (int id, IOrganizationService orgService) =>
            {
                var org = await orgService.GetByIdAsync(id);
                return org is null ? Results.NotFound() : Results.Ok(org.ToOrgDto());
            }).WithName("GetOrgById");

            app.MapPost("/org/members", async (
                CreateOrgMemberDto dto,
                ClaimsPrincipal claimsPrincipal,
                UserManager<AppUser> userManager,
                IOrganizationService orgService) =>
            {
                var userIdStr = userManager.GetUserId(claimsPrincipal);
                if (userIdStr is null || !int.TryParse(userIdStr, out var adminUserId))
                    return Results.Unauthorized();

                var (success, email, orgId, error) = await orgService.AddMemberAsync(dto, adminUserId);
                if (!success)
                    return error == "Forbidden" ? Results.Forbid() : Results.BadRequest(error);

                return Results.Ok(new { email, orgId });
            }).RequireAuthorization(policy => policy.RequireRole("OrgAdmin"));

            app.MapDelete("/organizations/{id}", async (int id, IOrganizationService orgService, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var isAdmin = http.User.IsInRole("Admin");
                var (success, error) = await orgService.DeleteAsync(id, userId, isAdmin);

                if (!success)
                    return error == "NotFound" ? Results.NotFound() : Results.BadRequest(error);
                return Results.Ok();
            }).RequireAuthorization();
        }
    }
}
