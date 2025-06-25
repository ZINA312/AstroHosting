using AstroHosting.Core.Entities;

namespace AstroHosting.Application.DTOs.Equipment
{
    public class EquipmentUpdateDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Manufacturer { get; set; } = string.Empty;
        public EquipmentTypes Type { get; set; }
        public Dictionary<string, string>? Specifications { get; set; } = null;
    }
}
