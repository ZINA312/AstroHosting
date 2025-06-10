using AstroHosting.API.ViewModels.User;

namespace AstroHosting.API.ViewModels.Subscription
{
    public class SubscriptionVm
    {
        public Guid Id { get; set; }
        public UserShortVm Subscriber { get; set; } = null!;
        public UserShortVm TargetUser { get; set; } = null!;
        public DateTime SubscriptionDate { get; set; }
    }
}
