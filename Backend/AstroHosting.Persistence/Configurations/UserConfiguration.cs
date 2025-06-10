using AstroHosting.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AstroHosting.Persistence.Configurations
{
    public class UserConfiguration : BaseEntityConfiguration<User>
    {
        public override void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.Login)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(u => u.AvatarUrl)
                .HasMaxLength(255)
                .IsRequired(false)
                .HasDefaultValue("/uploads/users/default.svg")
                .ValueGeneratedOnAdd();

            builder.Property(u => u.Bio)
                .HasMaxLength(500)
                .IsRequired(false);

        }
    }
}