namespace AstroHosting.Core.Entities
{
    public abstract class Entity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public Guid? CreatedBy { get; set; }
    }
}
