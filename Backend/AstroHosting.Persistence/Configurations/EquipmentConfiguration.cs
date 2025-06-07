using AstroHosting.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace AstroHosting.Persistence.Configurations
{
    public class EquipmentConfiguration : BaseEntityConfiguration<Equipment>
    {
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = null, 
            WriteIndented = false       
        };
        public override void Configure(EntityTypeBuilder<Equipment> builder)
        {
            builder.ToTable("Equipment");

            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.Manufacturer)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.Type)
                .IsRequired();

            builder.Property(e => e.Specifications)
                .HasColumnType("nvarchar(max)")
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonOptions),
                    v => JsonSerializer.Deserialize<Dictionary<string, string>>(v, JsonOptions) 
                    ?? new Dictionary<string, string>());
        }
    }
}