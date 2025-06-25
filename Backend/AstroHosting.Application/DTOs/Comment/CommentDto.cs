using AstroHosting.Application.DTOs.User;

namespace AstroHosting.Application.DTOs.Comment
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CommentDate { get; set; } 
        public UserShortDto User { get; set; } = null!;
    }
}
