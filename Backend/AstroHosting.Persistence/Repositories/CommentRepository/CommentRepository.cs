using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.CommentRepository
{
    public class CommentRepository : BaseRepository<Comment>, ICommentRepository
    {
        public CommentRepository(AstroHostingDBContext dbcontext, ILogger<Comment> logger) : base(dbcontext, logger) { }
    }
}
