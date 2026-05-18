using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Volunti.Data;
using Volunti.Dtos.Organization;
using Volunti.Mappers;
using Volunti.Models;

namespace Volunti.Endpoints
{
    public class OrganizationEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapGet("/organizations", async (VoluntiDbContext db) =>
            {
                var orgs = await db.Organizations.ToListAsync();
                return Results.Ok(orgs.Select(o => o.ToOrgDto()));
            });

            app.MapGet("/organizations/{id}", async (int id, VoluntiDbContext db) =>
            {
                var org = await db.Organizations.FindAsync(id);
                return org is null ? Results.NotFound() : Results.Ok(org.ToOrgDto());
            }).WithName("GetOrgById");

            app.MapPost("/org/members", async (
                CreateOrgMemberDto dto,
                ClaimsPrincipal claimsPrincipal,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var userIdStr = userManager.GetUserId(claimsPrincipal);
                if (userIdStr is null || !int.TryParse(userIdStr, out var adminUserId))
                    return Results.Unauthorized();

                var org = await db.Organizations.FirstOrDefaultAsync(o => o.UserId == adminUserId);
                if (org is null)
                    return Results.Forbid();

                var newUser = new AppUser { UserName = dto.Email.ToLower(), Email = dto.Email.ToLower() };
                var createdUser = await userManager.CreateAsync(newUser, dto.Password!);
                if (!createdUser.Succeeded)
                    return Results.BadRequest(createdUser.Errors.Select(e => e.Description));

                var roleResult = await userManager.AddToRoleAsync(newUser, "OrgUser");
                if (!roleResult.Succeeded)
                    return Results.Problem(string.Join(", ", roleResult.Errors.Select(e => e.Description)), statusCode: 500);

                db.OrganizationMembers.Add(new OrganizationMember
                {
                    UserId = newUser.Id,
                    OrganizationId = org.OrganizationId,
                    CreatedAt = DateTime.UtcNow
                });
                await db.SaveChangesAsync();

                return Results.Ok(new { newUser.Email, org.OrganizationId });
            }).RequireAuthorization(policy => policy.RequireRole("OrgAdmin"));


            // Endpoint för att ta bort en organization
            app.MapDelete("/organizations/{id}", async (int id, VoluntiDbContext db, HttpContext http) =>
            {
                var userIdClaim = http.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (userIdClaim == null)
                    return Results.Unauthorized();

                if (!int.TryParse(userIdClaim, out var userId))
                    return Results.Unauthorized();

                var isAdmin = http.User.IsInRole("Admin");

                var organization = await db.Organizations.Include(o => o.Jobs).FirstOrDefaultAsync(o => o.OrganizationId == id);

                if (organization == null)
                    return Results.NotFound("Organization hittades inte.");

                if (!isAdmin && organization.UserId != userId)
                    return Results.BadRequest("Du har inte behörighet att ta bort denna organization.");

                db.Jobs.RemoveRange(organization.Jobs);

                db.Organizations.Remove(organization);

                await db.SaveChangesAsync();

                return Results.Ok($"Organization: '{organization.OrgName}' med id: '{organization.OrganizationId}' togs bort.");
            })
            .RequireAuthorization();

        }
    }
}
