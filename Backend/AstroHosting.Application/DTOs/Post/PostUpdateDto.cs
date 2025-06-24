namespace AstroHosting.Application.DTOs.Post
{
    public class PostUpdateDto
    {
        public Guid Id { get; set; }
        public Guid AuthorId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool IsDeleted { get; set; }
        public List<Guid>? EquipmentIds { get; set; } = null;
    }
}
