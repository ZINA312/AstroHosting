using AstroHosting.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AstroHosting.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.HasKey(u => u.Id);

            builder.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.Login)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(u => u.RegistrationDate)
                .IsRequired();

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