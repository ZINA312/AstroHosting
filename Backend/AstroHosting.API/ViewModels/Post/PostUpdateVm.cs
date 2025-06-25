namespace AstroHosting.API.ViewModels.Post
{
    public class PostUpdateVm
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool IsDeleted { get; set; }
        public List<Guid>? EquipmentIds { get; set; } = null;
    }
}
