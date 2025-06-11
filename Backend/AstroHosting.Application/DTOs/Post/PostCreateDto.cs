namespace AstroHosting.Application.DTOs.Post
{
    public class PostCreateDto
    {
        public Guid AuthorId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = null!;
        public List<Guid>? EquipmentIds { get; set; } = null;
    }
}
