namespace AstroHosting.Core.Entities
{
    public class Equipment
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public EquipmentTypes Type { get; set; }
        public Dictionary<string, string> Specifications { get; set; } = [];
        public List<PostEquipment> PostsUsedIn { get; set; } = [];
    }
    public enum EquipmentTypes
    {
        Camera = 0,
        Lens = 1,
        ComaCorrector = 2,
        Flatner = 3,
        Mount = 4,
        Tripod = 5,
        Focuser = 6,
        GuideScope = 7,
        GuideCamera = 8,
        Filter = 9,
        Accessory = 10,
    }
}