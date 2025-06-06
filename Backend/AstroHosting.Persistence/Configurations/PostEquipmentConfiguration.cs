using AstroHosting.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AstroHosting.Persistence.Configurations
{
    public class PostEquipmentConfiguration : IEntityTypeConfiguration<PostEquipment>
    {
        public void Configure(EntityTypeBuilder<PostEquipment> builder)
        {
            builder.ToTable("PostEquipment");

            builder.HasKey(pe => new { pe.PostId, pe.EquipmentId });

            builder.HasOne(pe => pe.Post)
                .WithMany(p => p.EquipmentUsed)
                .HasForeignKey(pe => pe.PostId);

            builder.HasOne(pe => pe.Equipment)
                .WithMany(e => e.PostsUsedIn)
                .HasForeignKey(pe => pe.EquipmentId);
        }
    }
}