namespace AstroHosting.Application.DTOs.Subscription
{
    public class SubscriptionDeleteDto
    {
        public Guid SubscriberId { get; set; }
        public Guid TargetUserId { get; set; }
    }
}
