using AstroHosting.Persistence.Data;
using AstroHosting.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Reflection;

namespace AstroHosting.Persistence
{
    public static class Setup
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AstroHostingDBContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            return services;
        }

        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var repositoryTypes = assembly.GetTypes()
                .Where(type => !type.IsAbstract
                            && !type.IsInterface
                            && type.GetInterfaces()
                                   .Any(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IRepository<>)))
                .ToList();

            foreach (var repositoryType in repositoryTypes)
            {
                var interfaces = repositoryType.GetInterfaces()
                    .Where(i => i.GetInterfaces()
                                 .Any(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IRepository<>)))
                    .ToList();
                foreach (var interfaceType in interfaces)
                {
                    services.AddScoped(interfaceType, repositoryType);
                }
            }

            return services;
        }
    }
}
