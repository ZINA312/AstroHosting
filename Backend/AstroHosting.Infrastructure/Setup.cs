using AstroHosting.Infrastructure.JWT_Authentication;
using Microsoft.Extensions.DependencyInjection;
using AstroHosting.Infrastructure.Password_Hasher;

namespace AstroHosting.Infrastructure
{
    public static class Setup
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IJwtProvider, JwtProvider>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            
            return services;
        }
    }
}
