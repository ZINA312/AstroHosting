namespace AstroHosting.API.ViewModels.Post
{
    public class PostUpdateVm
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool IsDeleted { get; set; }
    }
}
