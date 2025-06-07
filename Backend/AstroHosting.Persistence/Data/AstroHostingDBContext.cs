using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AstroHosting.Persistence.Data
{
    public class AstroHostingDBContext : DbContext
    {
        public AstroHostingDBContext(DbContextOptions<AstroHostingDBContext> options) 
            : base(options) 
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
