using AstroHosting.API.ViewModels.User;

namespace AstroHosting.API.ViewModels.Comment
{
    public class CommentVm
    {
        public string Id { get; set; } = null!;
        public string Text { get; set; } = string.Empty;
        public string CommentDate { get; set; } = null!; 
        public UserShortVm User { get; set; } = null!;
    }
}
