using AstroHosting.API.ViewModels.User;

namespace AstroHosting.API.ViewModels.Subscription
{
    public class SubscriptionVm
    {
        public string Id { get; set; } = null!;
        public UserShortVm Subscriber { get; set; } = null!;
        public UserShortVm TargetUser { get; set; } = null!;
        public string SubscriptionDate { get; set; } = null!;
    }
}
