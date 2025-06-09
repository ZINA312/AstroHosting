namespace AstroHosting.API.ViewModels.Post
{
    public class PostUpdateVm
    {
        public string Id { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string IsDeleted { get; set; } = null!;
    }
}
