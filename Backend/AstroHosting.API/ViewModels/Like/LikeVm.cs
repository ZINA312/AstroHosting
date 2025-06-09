using AstroHosting.API.ViewModels.User;

namespace AstroHosting.API.ViewModels.Like
{
    public class LikeVm
    {
        public string Id { get; set; } = null!;
        public UserShortVm User { get; set; } = null!;
        public string PostId { get; set; } = null!;
    }
}
