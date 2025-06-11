using AstroHosting.Core.Entities;

namespace AstroHosting.Application.DTOs.Equipment
{
    public class EquipmentCreateDto
    {
        public string Name { get; set; } = null!;
        public string Manufacturer { get; set; } = string.Empty;
        public EquipmentTypes Type { get; set; }
        public Dictionary<string, string>? Specifications { get; set; } = null;
    }
}
