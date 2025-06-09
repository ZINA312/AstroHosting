using AstroHosting.Core.Entities;

namespace AstroHosting.API.ViewModels.Equipment
{
    public class EquipmentCreateVm
    {
        public string Name { get; set; } = null!;
        public string Manufacturer { get; set; } = string.Empty;
        public string Type { get; set; } = null!;
        public Dictionary<string, string>? Specifications { get; set; } = null;
    }
}
