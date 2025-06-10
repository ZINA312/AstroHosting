using AstroHosting.Core.Entities;

namespace AstroHosting.API.ViewModels.Equipment
{
    public class EquipmentCreateVm
    {
        public string Name { get; set; } = null!;
        public string Manufacturer { get; set; } = string.Empty;
        public EquipmentTypes Type { get; set; }
        public Dictionary<string, string>? Specifications { get; set; } = null;
    }
}
