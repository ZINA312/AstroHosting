using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.UserRepository
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AstroHostingDBContext dbcontext, ILogger<User> logger) : base(dbcontext, logger) { }

        public async Task<User?> GetByLoginAsync(string login)
        {
            try
            {
                var result = await _entities
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Login == login);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve user by login: {Login}", login);
                throw;
            }
        }
        public async Task<User?> GetUserProfileByIdAsync(Guid id) 
        {
            return await _entities
                .Where(u => u.Id == id)
                .Include(u => u.Posts) 
                .Include(u => u.SubscriptionsMade) 
                .Include(u => u.SubscriptionsReceived) 
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserWithAvatarByIdAsync(Guid id) 
        {
            return await _entities
                .AsNoTracking()
                .Where(u => u.Id == id)
                .Select(u => new User { Id = u.Id, AvatarUrl = u.AvatarUrl }) 
                .FirstOrDefaultAsync();
        }

        public async Task<IQueryable<User>> GetAllUsersWithSubscriptionsAsync()
        {
            return _entities
                .AsNoTracking()
                .Include(u => u.SubscriptionsReceived);
        }

        public async Task<IEnumerable<User>> SearchUsersAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return [];
            }

            var pattern = $"%{searchTerm}%";

            return await _entities
                .AsNoTracking()
                .Where(u => EF.Functions.Like(u.Username, pattern) || 
                            EF.Functions.Like(u.Login, pattern))
                .ToListAsync();
        }
    }
}
