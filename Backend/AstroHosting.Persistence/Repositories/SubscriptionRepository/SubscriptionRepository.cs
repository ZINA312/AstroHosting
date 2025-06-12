using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.SubscriptionRepository
{
    public class SubscriptionRepository : BaseRepository<Subscription>, ISubscriptionRepository
    {
        public SubscriptionRepository(AstroHostingDBContext dbcontext, ILogger<Subscription> logger) : base(dbcontext, logger) { }

    }
}
