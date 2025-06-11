using AstroHosting.API.ViewModels.User;

namespace AstroHosting.API.ViewModels.Like
{
    public class LikeVm
    {
        public Guid Id { get; set; }
        public UserShortVm User { get; set; } = null!;
        public Guid PostId { get; set; }
    }
}
