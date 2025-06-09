namespace AstroHosting.Application.DTOs.User
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string AvatarUrl { get; set; } = null!;
        public string Bio { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public int PostCount { get; set; }
        public int SubscribersCount { get; set; }
        public int SubscriptionsCount { get; set; }
    }
}
