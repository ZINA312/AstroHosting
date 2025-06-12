using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.PostRepository
{
    public class PostRepository : BaseRepository<Post>, IPostRepository
    {
        public PostRepository(AstroHostingDBContext dbcontext, ILogger<Post> logger) : base(dbcontext, logger) { }

    }
}
