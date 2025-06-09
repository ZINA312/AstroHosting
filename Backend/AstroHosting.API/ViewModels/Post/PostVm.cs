using AstroHosting.API.ViewModels.User;

namespace AstroHosting.API.ViewModels.Post
{
    public class PostVm
    {
        public string Id { get; set; } = null!;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public UserShortVm Author { get; set; } = null!;
        public string DateCreated { get; set; } = null!;
        public string LikesCount { get; set; } = null!;
        public string CommentsCount { get; set; } = null!;
    }
}
