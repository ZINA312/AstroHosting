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
                var result = await _entities.FirstOrDefaultAsync(u => u.Login == login);
                _logger.LogInformation("Retrieved user by login: {Login}", login);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve user by login: {Login}", login);
                throw;
            }
        }
    }
}
