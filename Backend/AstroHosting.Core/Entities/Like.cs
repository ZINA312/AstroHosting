namespace AstroHosting.Core.Entities
{
    public class Like : Entity
    {
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public User User { get; set; } = null!;
        public Post Post { get; set; } = null!;
    }
}
