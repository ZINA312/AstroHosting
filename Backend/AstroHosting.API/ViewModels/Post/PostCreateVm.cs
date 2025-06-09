namespace AstroHosting.API.ViewModels.Post
{
    public class PostCreateVm
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = null!;
        public List<string>? EquipmentIds { get; set; } = null;
    }
}
