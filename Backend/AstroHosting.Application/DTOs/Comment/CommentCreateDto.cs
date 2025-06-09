namespace AstroHosting.Application.DTOs.Comment
{
    public class CommentCreateDto
    {
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public string Text { get; set; } = null!;
    }
}
