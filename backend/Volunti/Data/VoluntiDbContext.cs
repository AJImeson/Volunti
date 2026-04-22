using Microsoft.EntityFrameworkCore;
using Volunti.Models;

namespace Volunti.Data
{
    public class VoluntiDbContext : DbContext
    {
        public VoluntiDbContext(DbContextOptions<VoluntiDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<VolunteerApplication> VolunteerApplications { get; set; }
        public DbSet<VolunteerSkill> VolunteerSkills { get; set; }
        public DbSet<VolunteerInterest> VolunteerInterests { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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


            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
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


            
        }
    }
}