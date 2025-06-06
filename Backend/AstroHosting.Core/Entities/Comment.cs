namespace AstroHosting.Core.Entities
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CommentDate { get; set; } = DateTime.UtcNow;
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public User User { get; set; } = null!;
        public Post Post { get; set; } = null!;
    }
}
