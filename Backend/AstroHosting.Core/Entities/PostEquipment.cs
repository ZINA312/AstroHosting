namespace AstroHosting.Core.Entities
{
    public class PostEquipment
    {
        public Guid PostId { get; set; }
        public Guid EquipmentId { get; set; }
        public Post Post { get; set; } = null!;
        public Equipment Equipment { get; set; } = null!;
    }
}
