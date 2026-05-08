using Microsoft.EntityFrameworkCore;
using Volunti.Data;
using Volunti.Mappers;

namespace Volunti.Endpoints
{
    public class JobEndpoints
    {
        public static void RegisterEndpoints(WebApplication app)
        {
            app.MapGet("/jobs", async (VoluntiDbContext db) =>
            {
                var jobs = await db.Jobs.ToListAsync();
                return Results.Ok(jobs.Select(j => j.ToJobDto()));
            });

            app.MapGet("/jobs/{id}", async (int id, VoluntiDbContext db) =>
            {
                var job = await db.Jobs.FindAsync(id);
                return job is null ? Results.NotFound() : Results.Ok(job.ToJobDto());
            });
        }
    }
}
