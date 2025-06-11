using AstroHosting.API.ViewModels.Comment;
using AstroHosting.API.ViewModels.Equipment;
using AstroHosting.API.ViewModels.User;

namespace AstroHosting.API.ViewModels.Post
{
    public class PostDetailsVm : PostVm
    {
        public List<CommentVm>? Comments { get; set; } = null;
        public List<UserShortVm>? LikedBy { get; set; } = null;
        public List<EquipmentVm>? EquipmentUsed { get; set; } = null;
    }
}
