using AstroHosting.API.ViewModels.User;

namespace AstroHosting.API.ViewModels.Comment
{
    public class CommentVm
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CommentDate { get; set; }
        public UserShortVm User { get; set; } = null!;
    }
}
