using AstroHosting.Infrastructure.JWT_Authentication;
using Microsoft.Extensions.DependencyInjection;
using AstroHosting.Infrastructure.Password_Hasher;
using AstroHosting.Infrastructure.Services;

namespace AstroHosting.Infrastructure
{
    public static class Setup
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IJwtProvider, JwtProvider>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IFileService, FileService>();
            return services;
        }
    }
}
