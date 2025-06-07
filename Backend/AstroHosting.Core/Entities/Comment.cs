namespace AstroHosting.Core.Entities
{
    public class Comment : Entity
    {
        public string Text { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public User User { get; set; } = null!;
        public Post Post { get; set; } = null!;
    }
}
