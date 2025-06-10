namespace AstroHosting.Core.Entities
{
    public class Subscription : Entity
    {
        public Guid SubscriberId { get; set; }
        public Guid TargetUserId { get; set; }
        public User Subscriber { get; set; } = null!;
        public User TargetUser { get; set; } = null!;
    }
}
