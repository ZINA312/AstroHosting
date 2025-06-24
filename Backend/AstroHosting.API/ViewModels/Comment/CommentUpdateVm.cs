namespace AstroHosting.API.ViewModels.Comment
{
    public class CommentUpdateVm
    {
        public Guid CommentId { get; set; }
        public string Text { get; set; } = null!;
    }
}
