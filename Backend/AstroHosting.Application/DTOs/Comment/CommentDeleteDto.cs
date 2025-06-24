namespace AstroHosting.Application.DTOs.Comment
{
    public class CommentDeleteDto
    {
        public Guid CommentId { get; set; }
        public Guid UserId { get; set; }
    }
}