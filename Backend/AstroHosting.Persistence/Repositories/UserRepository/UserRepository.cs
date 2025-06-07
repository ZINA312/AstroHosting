using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.UserRepository
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AstroHostingDBContext dbcontext, ILogger logger) : base(dbcontext, logger) { }
    }
}
