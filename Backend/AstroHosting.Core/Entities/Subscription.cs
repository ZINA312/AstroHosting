namespace AstroHosting.Core.Entities
{
    public class Subscription
    {
        public Guid Id { get; set; }
        public Guid SubscriberId { get; set; }
        public Guid TargetUserId { get; set; }
        public User Subscriber { get; set; } = null!;
        public User TargetUser { get; set; } = null!;
        public DateTime SubscriptionDate { get; set; } = DateTime.UtcNow;
    }
}
