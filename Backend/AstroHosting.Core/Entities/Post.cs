namespace AstroHosting.Core.Entities
{
    public class Post : Entity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public Guid AuthorId { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedDate { get; set; }
        public User Author { get; set; } = null!;
        public List<Comment> Comments { get; set; } = [];
        public List<Like> Likes { get; set; } = [];
        public List<PostEquipment> EquipmentUsed { get; set; } = [];
    }
}
