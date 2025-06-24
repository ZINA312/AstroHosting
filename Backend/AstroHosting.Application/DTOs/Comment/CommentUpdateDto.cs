namespace AstroHosting.Application.DTOs.Comment
{
    public class CommentUpdateDto
    {
        public Guid CommentId { get; set; }
        public Guid UserId { get; set; }
        public string Text { get; set; } = null!;
    }
}