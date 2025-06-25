using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.LikeRepository
{
    public class LikeRepository : BaseRepository<Like>, ILikeRepository
    {
        public LikeRepository(AstroHostingDBContext dbcontext, ILogger<Like> logger) : base(dbcontext, logger) { }
    }
}
