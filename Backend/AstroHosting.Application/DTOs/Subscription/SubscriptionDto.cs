using AstroHosting.Application.DTOs.User;

namespace AstroHosting.Application.DTOs.Subscription
{
    public class SubscriptionDto
    {
        public Guid Id { get; set; }
        public UserShortDto Subscriber { get; set; } = null!;
        public UserShortDto TargetUser { get; set; } = null!;
        public DateTime SubscriptionDate { get; set; }
    }
}
