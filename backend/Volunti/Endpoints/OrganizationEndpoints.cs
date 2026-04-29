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

            app.MapPost("/organizations", async (
                CreateOrgDto orgDto,
                ClaimsPrincipal claimsPrincipal,
                UserManager<AppUser> userManager,
                VoluntiDbContext db) =>
            {
                var userIdStr = userManager.GetUserId(claimsPrincipal);
                if (userIdStr is null || !int.TryParse(userIdStr, out var userId))
                    return Results.Unauthorized();

                var newOrg = orgDto.ToOrgFromCreateDTO();
                newOrg.UserId = userId;
                db.Organizations.Add(newOrg);
                await db.SaveChangesAsync();
                return Results.CreatedAtRoute("GetOrgById", new { id = newOrg.OrganizationId }, newOrg.ToOrgDto());
            }).RequireAuthorization();
        }
    }
}
