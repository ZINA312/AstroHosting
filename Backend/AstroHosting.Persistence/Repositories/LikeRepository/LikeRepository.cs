using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.LikeRepository
{
    public class LikeRepository : BaseRepository<Like>, ILikeRepository
    {
        public LikeRepository(AstroHostingDBContext dbcontext, ILogger<Like> logger) : base(dbcontext, logger) { }

        public async Task<Like?> GetByUserIdAndPostIdAsync(Guid userId, Guid postId)
        {
            return await _entities
                .Where(l => l.UserId == userId && l.PostId == postId)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Like>> GetLikesByPostIdWithUserAsync(Guid postId)
        {
            return await _entities
                .Where(l => l.PostId == postId)
                .Include(l => l.User)
                .ToListAsync();
        }

        public async Task<Like?> GetByIdWithUserAsync(Guid id)
        {
            return await _entities
                .Where(l => l.Id == id)
                .Include(l => l.User)
                .FirstOrDefaultAsync();
        }
    }
}
