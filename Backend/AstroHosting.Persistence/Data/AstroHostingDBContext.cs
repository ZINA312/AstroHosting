using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;

namespace AstroHosting.Persistence.Data
{
    public class AstroHostingDBContext : DbContext
    {
        public AstroHostingDBContext(DbContextOptions<AstroHostingDBContext> options) : base(options) 
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<PostEquipment> PostEquipments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new SubscriptionConfiguration());
            modelBuilder.ApplyConfiguration(new PostConfiguration());
            modelBuilder.ApplyConfiguration(new LikeConfiguration());
            modelBuilder.ApplyConfiguration(new EquipmentConfiguration());
            modelBuilder.ApplyConfiguration(new CommentConfiguration());
            modelBuilder.ApplyConfiguration(new PostEquipmentConfiguration());
        }
    }
}
