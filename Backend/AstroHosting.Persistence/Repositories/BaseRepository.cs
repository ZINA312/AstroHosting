using AstroHosting.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories
{
    public class BaseRepository<T> : IRepository<T> where T : class
    {
        private readonly AstroHostingDBContext _context;
        protected readonly ILogger<T> _logger;
        protected DbSet<T> _entities;

        public BaseRepository(AstroHostingDBContext dbContext, ILogger<T> logger)
        {
            _context = dbContext;
            _logger = logger;
            _entities = _context.Set<T>();
        }

        public async Task AddAsync(T entity)
        {
            try
            {
                await _entities.AddAsync(entity);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                _logger.LogError("Failed on adding entity {EntityType}", typeof(T));
            }
        }

        public async Task DeleteAsync(T entity)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(entity);
                _entities.Remove(entity);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                _logger.LogError("Failed on deleting entity {EntityType}", typeof(T));
            }
        }

        public async Task<T?> FindAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate)
        {
            return await _entities.FirstOrDefaultAsync(predicate);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _entities.AsNoTracking().ToListAsync();
        }

        public async Task<T?> GetByIdAsync(Guid id)
        {
            return await _entities.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetWhereAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate)
        {
            return await _entities.Where(predicate).ToListAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(entity);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                _logger.LogError("Failed on updating entity {EntityType}", typeof(T));
            }
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _entities.FindAsync(id) != null;
        }
    }
}
