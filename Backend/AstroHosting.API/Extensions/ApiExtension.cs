using AstroHosting.Infrastructure.JWT_Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AstroHosting.API.Extensions
{
    public static class ApiExtension
    {
        public static void AddApiAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var options = configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(jwtOptions =>
                {
                    jwtOptions.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = options.Issuer,
                        ValidAudience = options.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.SecretKey))
                    };
                    jwtOptions.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                            return Task.CompletedTask;
                        },
                        OnTokenValidated = context =>
                        {
                            Console.WriteLine("Token validated successfully");
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization();
        }
    }
}
