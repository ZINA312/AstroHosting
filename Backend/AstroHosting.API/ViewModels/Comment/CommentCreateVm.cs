namespace AstroHosting.API.ViewModels.Comment
{
    public class CommentCreateVm
    {
        public Guid PostId { get; set; }
        public string Text { get; set; } = null!;
    }
}
