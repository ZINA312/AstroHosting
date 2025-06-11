namespace AstroHosting.Application.DTOs.Subscription
{
    public class SubscriptionCreateDto
    {
        public Guid SubscriberId { get; set; }
        public Guid TargetUserId { get; set; }
    }
}
