using AstroHosting.Application.DTOs.User;

namespace AstroHosting.Application.DTOs.Post
{
    public class PostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public UserShortDto Author { get; set; } = null!;
        public DateTime DateCreated { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
    }
}
