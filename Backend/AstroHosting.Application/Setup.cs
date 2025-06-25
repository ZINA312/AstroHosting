using Microsoft.Extensions.DependencyInjection;

namespace AstroHosting.Application
{
    public static class Setup
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            var applicationAssembly = typeof(Setup).Assembly;

            var serviceImplementations = applicationAssembly.GetTypes()
                .Where(type => type.IsClass && !type.IsAbstract && !type.IsGenericTypeDefinition && type.Name.EndsWith("Service"))
                .ToList();

            foreach (var implementationType in serviceImplementations)
            {
                var serviceInterface = implementationType.GetInterfaces()
                    .FirstOrDefault(i => i.Name == $"I{implementationType.Name}");

                if (serviceInterface != null)
                {
                    services.AddScoped(serviceInterface, implementationType);
                }
            }

            return services;
        }
    }
}
