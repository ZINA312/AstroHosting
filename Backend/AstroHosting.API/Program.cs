using AstroHosting.API.Extensions;
using AstroHosting.Application;
using AstroHosting.Infrastructure;
using AstroHosting.Infrastructure.JWT_Authentication;
using AstroHosting.Persistence;
using AstroHosting.Persistence.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddLogging(configure =>
{
    configure.AddConsole();
    configure.AddDebug();
});
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(nameof(JwtOptions))
);

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddMaps("AstroHosting.API", "AstroHosting.Application");
});

builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddRepositories();
builder.Services.AddApplication();
builder.Services.AddInfrastructure();

builder.Services.AddApiAuthentication(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AstroHostingDBContext>();
    var logger = services.GetRequiredService<ILogger<AstroHostingDBContext>>();
    try
    {
        await DbInitializer.Initialize(services);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
