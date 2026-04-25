using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
  public class ApplicationDbContext : IdentityDbContext<AppUser>
  {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> dbContextOptions) : base(dbContextOptions)
    {
      
    }

    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Job> Jobs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      List<IdentityRole> roles = new List<IdentityRole>
      {
       new IdentityRole { Id = "11111111-1111-1111-1111-111111111111", ConcurrencyStamp = "1", Name = "Admin",        NormalizedName = "ADMIN" },
       new IdentityRole { Id = "22222222-2222-2222-2222-222222222222", ConcurrencyStamp = "2", Name = "Volunteer",    NormalizedName = "VOLUNTEER" },
       new IdentityRole { Id = "33333333-3333-3333-3333-333333333333", ConcurrencyStamp = "3", Name = "Organization", NormalizedName = "ORGANIZATION" }
      };
      builder.Entity<IdentityRole>().HasData(roles);
    }
  }
}