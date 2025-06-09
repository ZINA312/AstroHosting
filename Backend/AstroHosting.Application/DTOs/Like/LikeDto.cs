using AstroHosting.Application.DTOs.User;

namespace AstroHosting.Application.DTOs.Like
{
    public class LikeDto
    {
        public Guid Id { get; set; }
        public UserShortDto User { get; set; } = null!;
        public Guid PostId { get; set; }
    }
}
