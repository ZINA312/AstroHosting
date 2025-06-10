namespace AstroHosting.Core.Entities
{
    public class User : Entity
    {
        public string Username { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public List<Subscription> SubscriptionsMade { get; set; } = []; 
        public List<Subscription> SubscriptionsReceived { get; set; } = []; 
        public List<Post> Posts { get; set; } = [];
        public List<Like> Likes { get; set; } = [];
        public List<Comment> Comments { get; set; } = [];
    }
}