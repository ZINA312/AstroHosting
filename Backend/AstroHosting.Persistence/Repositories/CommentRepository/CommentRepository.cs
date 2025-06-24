using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.CommentRepository
{
    public class CommentRepository : BaseRepository<Comment>, ICommentRepository
    {
        public CommentRepository(AstroHostingDBContext dbcontext, ILogger<Comment> logger) : base(dbcontext, logger) { }

        public async Task<IEnumerable<Comment>> GetByPostIdWithUserAsync(Guid postId)
        {
            return await _entities
                            .Where(c => c.PostId == postId)
                            .Include(c => c.User)
                            .AsNoTracking()
                            .ToListAsync();
        }

        public async Task<Comment?> GetByIdWithUserAsync(Guid commentId)
        {
            return await _entities
                            .Include(c => c.User)
                            .FirstOrDefaultAsync(c => c.Id == commentId);
        }
    }
}
