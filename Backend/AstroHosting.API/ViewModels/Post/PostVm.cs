using AstroHosting.API.ViewModels.User;

namespace AstroHosting.API.ViewModels.Post
{
    public class PostVm
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public UserShortVm Author { get; set; } = null!;
        public DateTime DateCreated { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
    }
}
