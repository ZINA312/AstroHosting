using AstroHosting.Core.Entities;

namespace AstroHosting.Persistence.Repositories.EquipmentRepository
{
    public interface IEquipmentRepository : IRepository<Equipment>
    {
        Task<IEnumerable<Equipment>> SearchEquipmentAsync(string searchTerm);
    }
}
