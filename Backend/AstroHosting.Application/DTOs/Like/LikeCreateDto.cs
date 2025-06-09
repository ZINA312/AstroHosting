namespace AstroHosting.Application.DTOs.Like
{
    public class LikeCreateDto
    {
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
    }
}
