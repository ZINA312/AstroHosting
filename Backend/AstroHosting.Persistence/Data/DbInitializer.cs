using AstroHosting.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AstroHosting.Infrastructure.Password_Hasher;

namespace AstroHosting.Persistence.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AstroHostingDBContext>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<AstroHostingDBContext>>();
                var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

                try
                {
                    logger.LogInformation("Applying pending migrations...");
                    await context.Database.MigrateAsync();
                    logger.LogInformation("Migrations applied successfully.");

                    if (await context.Set<User>().AnyAsync())
                    {
                        logger.LogInformation("Database already seeded. Skipping initialization.");
                        return;
                    }

                    logger.LogInformation("Seeding database with test data...");

                    var user1 = new User
                    {
                        Username = "Astrophile",
                        Login = "astro@example.com",
                        PasswordHash = passwordHasher.Generate("Password123!"),
                        AvatarUrl = "/uploads/users/default.svg",
                        Bio = "Любитель астрофотографии, исследую глубины космоса.",
                        DateCreated = DateTime.UtcNow.AddMonths(-12),
                        DateUpdated = DateTime.UtcNow.AddMonths(-12)
                    };

                    var user2 = new User
                    {
                        Username = "StarGazer",
                        Login = "star@example.com",
                        PasswordHash = passwordHasher.Generate("Password123!"),
                        AvatarUrl = "/uploads/users/default.svg",
                        Bio = "Начинающий астроном, всегда ищу новые созвездия.",
                        DateCreated = DateTime.UtcNow.AddMonths(-8),
                        DateUpdated = DateTime.UtcNow.AddMonths(-8)
                    };

                    var user3 = new User
                    {
                        Username = "CosmoExplorer",
                        Login = "cosmo@example.com",
                        PasswordHash = passwordHasher.Generate("Password123!"),
                        AvatarUrl = "/uploads/users/default.svg",
                        Bio = "Поиск внеземной жизни и новых миров.",
                        DateCreated = DateTime.UtcNow.AddMonths(-5),
                        DateUpdated = DateTime.UtcNow.AddMonths(-5)
                    };

                    await context.Set<User>().AddRangeAsync(user1, user2, user3); 
                    await context.SaveChangesAsync();
                    logger.LogInformation("Users seeded.");

                    var camera1 = new Equipment
                    {
                        Name = "ZWO ASI294MC Pro",
                        Manufacturer = "ZWO",
                        Type = EquipmentTypes.Camera,
                        Specifications = new Dictionary<string, string>
                        {
                            { "Sensor Size", "Four Thirds" },
                            { "Resolution", "4144x2822" },
                            { "Cooling", "TEC" }
                        },
                        DateCreated = DateTime.UtcNow.AddMonths(-11)
                    };

                    var lens1 = new Equipment
                    {
                        Name = "Rokinon 135mm f/2.0",
                        Manufacturer = "Rokinon",
                        Type = EquipmentTypes.Lens,
                        Specifications = new Dictionary<string, string>
                        {
                            { "Focal Length", "135mm" },
                            { "Aperture", "f/2.0" }
                        },
                        DateCreated = DateTime.UtcNow.AddMonths(-10)
                    };

                    var mount1 = new Equipment
                    {
                        Name = "Sky-Watcher EQ6-R Pro",
                        Manufacturer = "Sky-Watcher",
                        Type = EquipmentTypes.Mount,
                        Specifications = new Dictionary<string, string>
                        {
                            { "Mount Type", "Equatorial" },
                            { "Payload Capacity", "20kg" }
                        },
                        DateCreated = DateTime.UtcNow.AddMonths(-9)
                    };

                    await context.Set<Equipment>().AddRangeAsync(camera1, lens1, mount1); 
                    await context.SaveChangesAsync();
                    logger.LogInformation("Equipment seeded.");

                    var post1 = new Post
                    {
                        Title = "Галактика Андромеды: мой первый снимок!",
                        Description = "Долгожданный первый снимок галактики Андромеды с моей новой камерой. Все еще учусь, но очень доволен результатом!",
                        ImageUrl = "/uploads/posts/default_andromeda.jpg",
                        AuthorId = user1.Id,
                        DateCreated = DateTime.UtcNow.AddMonths(-7),
                        DateUpdated = DateTime.UtcNow.AddMonths(-7)
                    };

                    var post2 = new Post
                    {
                        Title = "Туманность Ориона с Rokinon 135mm",
                        Description = "Прекрасная туманность Ориона, снятая с использованием Rokinon 135mm. Потрясающие цвета!",
                        ImageUrl = "/uploads/posts/default_orion.jpg",
                        AuthorId = user2.Id,
                        DateCreated = DateTime.UtcNow.AddMonths(-6),
                        DateUpdated = DateTime.UtcNow.AddMonths(-6)
                    };

                    var post3 = new Post
                    {
                        Title = "Луна крупным планом",
                        Description = "Снимок Луны с высоким разрешением. Видны все кратеры и моря.",
                        ImageUrl = "/uploads/posts/default_moon.jpg",
                        AuthorId = user1.Id,
                        DateCreated = DateTime.UtcNow.AddMonths(-4),
                        DateUpdated = DateTime.UtcNow.AddMonths(-4)
                    };

                    var post4Deleted = new Post
                    {
                        Title = "Удаленный пост: Тестовый объект",
                        Description = "Это тестовый пост, который был мягко удален. Виден только автору.",
                        ImageUrl = "/uploads/posts/default_deleted.jpg",
                        AuthorId = user1.Id,
                        IsDeleted = true,
                        DeletedDate = DateTime.UtcNow.AddDays(-5),
                        DateCreated = DateTime.UtcNow.AddMonths(-2),
                        DateUpdated = DateTime.UtcNow.AddDays(-5)
                    };

                    await context.Set<Post>().AddRangeAsync(post1, post2, post3, post4Deleted);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Posts seeded.");

                    await context.Set<PostEquipment>().AddRangeAsync( 
                        new PostEquipment { PostId = post1.Id, EquipmentId = camera1.Id },
                        new PostEquipment { PostId = post1.Id, EquipmentId = mount1.Id },
                        new PostEquipment { PostId = post2.Id, EquipmentId = lens1.Id },
                        new PostEquipment { PostId = post2.Id, EquipmentId = camera1.Id },
                        new PostEquipment { PostId = post3.Id, EquipmentId = camera1.Id }
                    );
                    await context.SaveChangesAsync();
                    logger.LogInformation("PostEquipment relationships seeded.");

                    await context.Set<Like>().AddRangeAsync( 
                        new Like { PostId = post1.Id, UserId = user2.Id, DateCreated = DateTime.UtcNow.AddMonths(-5).AddDays(5) },
                        new Like { PostId = post1.Id, UserId = user3.Id, DateCreated = DateTime.UtcNow.AddMonths(-5).AddDays(10) },
                        new Like { PostId = post2.Id, UserId = user1.Id, DateCreated = DateTime.UtcNow.AddMonths(-5).AddDays(15) },
                        new Like { PostId = post3.Id, UserId = user2.Id, DateCreated = DateTime.UtcNow.AddMonths(-3).AddDays(5) },
                        new Like { PostId = post3.Id, UserId = user1.Id, DateCreated = DateTime.UtcNow.AddMonths(-3).AddDays(10) },
                        new Like { PostId = post3.Id, UserId = user3.Id, DateCreated = DateTime.UtcNow.AddMonths(-3).AddDays(15) }
                    );
                    await context.SaveChangesAsync();
                    logger.LogInformation("Likes seeded.");

                    await context.Set<Subscription>().AddRangeAsync( 
                        new Subscription { SubscriberId = user2.Id, TargetUserId = user1.Id, DateCreated = DateTime.UtcNow.AddMonths(-8).AddDays(3) },
                        new Subscription { SubscriberId = user3.Id, TargetUserId = user1.Id, DateCreated = DateTime.UtcNow.AddMonths(-4).AddDays(7) },
                        new Subscription { SubscriberId = user1.Id, TargetUserId = user2.Id, DateCreated = DateTime.UtcNow.AddMonths(-3).AddDays(12) }
                    );
                    await context.SaveChangesAsync();
                    logger.LogInformation("Subscriptions seeded.");

                    logger.LogInformation("Database initialization completed successfully.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while seeding the database: {Message}", ex.Message);
                }
            }
        }
    }
}