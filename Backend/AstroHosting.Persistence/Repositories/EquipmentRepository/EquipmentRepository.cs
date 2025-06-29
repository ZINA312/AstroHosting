using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.EquipmentRepository
{
    public class EquipmentRepository : BaseRepository<Equipment>, IEquipmentRepository
    {
        public EquipmentRepository(AstroHostingDBContext dbcontext, ILogger<Equipment> logger) : base(dbcontext, logger) { }

        public async Task<IEnumerable<Equipment>> SearchEquipmentAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return [];
            }

            var pattern = $"%{searchTerm}%"; 

            return await _entities
                .AsNoTracking()
                .Where(e => EF.Functions.Like(e.Name, pattern)) 
                .ToListAsync();
        }
    }
}
