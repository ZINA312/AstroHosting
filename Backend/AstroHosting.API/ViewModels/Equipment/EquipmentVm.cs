using AstroHosting.Core.Entities;

namespace AstroHosting.API.ViewModels.Equipment
{
    public class EquipmentVm
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public string Type { get; set; } = null!;
        public Dictionary<string, string> Specifications { get; set; } = [];
    }
}
