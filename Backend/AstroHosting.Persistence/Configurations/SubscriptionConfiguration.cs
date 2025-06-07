using AstroHosting.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AstroHosting.Persistence.Configurations
{
    public class SubscriptionConfiguration : BaseEntityConfiguration<Subscription>
    {
        public override void Configure(EntityTypeBuilder<Subscription> builder)
        {
            builder.ToTable("Subscriptions");

            builder.HasOne(s => s.Subscriber)
                .WithMany(u => u.SubscriptionsMade)
                .HasForeignKey(s => s.SubscriberId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(s => s.TargetUser)
                .WithMany(u => u.SubscriptionsReceived)
                .HasForeignKey(s => s.TargetUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}