using AstroHosting.Application.Services.UserService;
using Microsoft.Extensions.DependencyInjection;

namespace AstroHosting.Application
{
    public static class Setup
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();

            return services;
        }
    }
}
