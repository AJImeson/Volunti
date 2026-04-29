using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Dtos.Organization;
using Volunti.Mappers;

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

            app.MapPost("/organizations", async (CreateOrgDto orgDto, VoluntiDbContext db) =>
            {
                var newOrg = orgDto.ToOrgFromCreateDTO();
                db.Organizations.Add(newOrg);
                await db.SaveChangesAsync();
                return Results.CreatedAtRoute("GetOrgById", new { id = newOrg.OrganizationId }, newOrg.ToOrgDto());
            });
        }
    }
}
