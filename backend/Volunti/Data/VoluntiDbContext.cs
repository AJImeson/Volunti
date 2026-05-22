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

        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<VolunteerApplication> VolunteerApplications { get; set; }
        public DbSet<VolunteerSkill> VolunteerSkills { get; set; }
        public DbSet<VolunteerInterest> VolunteerInterests { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<OrganizationMember> OrganizationMembers { get; set; }
        
        public DbSet<VolunteerFile> VolunteerFiles { get; set; }
        
        public DbSet<VolunteerExperience> VolunteerExperiences { get; set; }
        
        public DbSet<VolunteerAvailability> VolunteerAvailabilities { get; set; }

        public DbSet<JobLike> JobLikes { get; set; }
        public DbSet<JobComment> JobComments { get; set; }

        public DbSet<JobCommentLike> JobCommentLikes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>().ToTable("Users");
            modelBuilder.Entity<Role>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");

            List<Role> roles = new List<Role>
            {
                new Role { Id = 11111, ConcurrencyStamp = "1", Name = "Admin",        NormalizedName = "ADMIN",        RoleType = "Admin" },
                new Role { Id = 22222, ConcurrencyStamp = "2", Name = "Volunteer",    NormalizedName = "VOLUNTEER",    RoleType = "Volunteer" },
                new Role { Id = 33333, ConcurrencyStamp = "3", Name = "OrgAdmin", NormalizedName = "ORGADMIN", RoleType = "OrgAdmin" },
                new Role { Id = 44444, ConcurrencyStamp = "4", Name = "OrgUser",  NormalizedName = "ORGUSER",  RoleType = "OrgUser" }
            };


            modelBuilder.Entity<Role>().HasData(roles);

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


            modelBuilder.Entity<Organization>()
                .HasOne(o => o.User)
                .WithOne(r => r.Organization)
                .HasForeignKey<Organization>(o => o.UserId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Volunteer>()
                .HasOne(v => v.User)
                .WithOne(u => u.Volunteer)
                .HasForeignKey<Volunteer>(v => v.UserId)
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

            modelBuilder.Entity<OrganizationMember>()
                .HasOne(m => m.User)
                .WithOne(u => u.OrganizationMember)
                .HasForeignKey<OrganizationMember>(m => m.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<OrganizationMember>()
                .HasOne(m => m.Organization)
                .WithMany(o => o.Members)
                .HasForeignKey(m => m.OrganizationId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Job>()
                .Property(Job => Job.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Job>()
                .Property(j => j.Category)
                .HasConversion<string>();
                
            modelBuilder.Entity<VolunteerAvailability>()
                .HasIndex(va => new { va.VolunteerId, va.Date })
                .IsUnique();

            modelBuilder.Entity<VolunteerAvailability>()
                .HasOne(va => va.Volunteer)
                .WithMany()
                .HasForeignKey(va => va.VolunteerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobLike>()
                .HasIndex(jl => new { jl.JobId, jl.UserId })
                .IsUnique();

            modelBuilder.Entity<JobLike>()
                .HasOne(jl => jl.Job)
                .WithMany()
                .HasForeignKey(jl => jl.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobLike>()
                .HasOne(jl => jl.User)
                .WithMany()
                .HasForeignKey(jl => jl.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // JobComment
            modelBuilder.Entity<JobComment>()
                .HasOne(c => c.Job)
                .WithMany()
                .HasForeignKey(c => c.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobComment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<JobComment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<JobCommentLike>()
                .HasIndex(cl => new { cl.CommentId, cl.UserId })
                .IsUnique();

            modelBuilder.Entity<JobCommentLike>()
                .HasOne(cl => cl.Comment)
                .WithMany()
                .HasForeignKey(cl => cl.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobCommentLike>()
                .HasOne(cl => cl.User)
                .WithMany()
                .HasForeignKey(cl => cl.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}