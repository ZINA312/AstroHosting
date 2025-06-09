namespace AstroHosting.API.ViewModels.User
{
    public class UserProfileVm
    {
        public string Id { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string AvatarUrl { get; set; } = null!;
        public string Bio { get; set; } = string.Empty;
        public string RegistrationDate { get; set; } = null!;
        public string PostCount { get; set; } = null!;
        public string SubscribersCount { get; set; } = null!;
        public string SubscriptionsCount { get; set; } = null!;
    }
}
