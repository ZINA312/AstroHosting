using AstroHosting.Core.Entities;

namespace AstroHosting.API.ViewModels.Equipment
{
    public class EquipmentVm
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public EquipmentTypes Type { get; set; }
        public Dictionary<string, string> Specifications { get; set; } = [];
    }
}
