using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Volunti.Models;


namespace Volunti.Data
{
    public class VoluntiDbContext : IdentityDbContext<AppUser, Role, int>
    {
        public VoluntiDbContext(DbContextOptions<VoluntiDbContext> options)
            : base(options)
        {
        }

        public DbSet<AppUser> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<VolunteerApplication> VolunteerApplications { get; set; }
        public DbSet<VolunteerSkill> VolunteerSkills { get; set; }
        public DbSet<VolunteerInterest> VolunteerInterests { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole { Id = "11111111-1111-1111-1111-111111111111", ConcurrencyStamp = "1", Name = "Admin",        NormalizedName = "ADMIN" },
                new IdentityRole { Id = "22222222-2222-2222-2222-222222222222", ConcurrencyStamp = "2", Name = "Volunteer",    NormalizedName = "VOLUNTEER" },
                new IdentityRole { Id = "33333333-3333-3333-3333-333333333333", ConcurrencyStamp = "3", Name = "Organization", NormalizedName = "ORGANIZATION" }
            };
            modelBuilder.Entity<IdentityRole>().HasData(roles);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany()
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<AppUser>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.Role)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Organization>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Organization>()
                .HasOne(o => o.Role)
                .WithMany(r => r.Organizations)
                .HasForeignKey(o => o.RoleId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Volunteer>()
                .HasOne(v => v.User)
                .WithMany()
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Volunteer>()
                .HasOne(v => v.Role)
                .WithMany(r => r.Volunteers)
                .HasForeignKey(v => v.RoleId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<PasswordResetToken>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.NoAction);

        }
    }
}