namespace AstroHosting.Core.Entities
{
    public class Like
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public User User { get; set; } = null!;
        public Post Post { get; set; } = null!;
        public DateTime LikeDate { get; set; } = DateTime.UtcNow;
    }
}
