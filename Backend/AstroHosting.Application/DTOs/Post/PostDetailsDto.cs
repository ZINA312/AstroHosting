using AstroHosting.Application.DTOs.Comment;
using AstroHosting.Application.DTOs.Equipment;
using AstroHosting.Application.DTOs.User;

namespace AstroHosting.Application.DTOs.Post
{
    public class PostDetailsDto : PostDto
    {
        public List<CommentDto>? Comments { get; set; } = null;
        public List<UserShortDto>? LikedBy { get; set; } = null;
        public List<EquipmentDto>? EquipmentUsed { get; set; } = null;
    }
}
