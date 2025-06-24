using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.SubscriptionRepository
{
    public class SubscriptionRepository : BaseRepository<Subscription>, ISubscriptionRepository
    {
        public SubscriptionRepository(AstroHostingDBContext dbcontext, ILogger<Subscription> logger) : base(dbcontext, logger) { }
        public async Task<Subscription?> GetBySubscriberAndTargetUserAsync(Guid subscriberId, Guid targetUserId)
        {
            return await _entities
                .Where(s => s.SubscriberId == subscriberId && s.TargetUserId == targetUserId)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Subscription>> GetSubscriptionsMadeByUserAsync(Guid subscriberId)
        {
            return await _entities
                .Where(s => s.SubscriberId == subscriberId)
                .Include(s => s.Subscriber) 
                .Include(s => s.TargetUser) 
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Subscription>> GetSubscriptionsReceivedByUserAsync(Guid targetUserId)
        {
            return await _entities
                .Where(s => s.TargetUserId == targetUserId)
                .Include(s => s.Subscriber) 
                .Include(s => s.TargetUser) 
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Subscription?> GetByIdWithUserAsync(Guid id)
        {
            return await _entities
                .Where(s => s.Id == id)
                .Include(s => s.Subscriber)
                .Include(s => s.TargetUser)
                .FirstOrDefaultAsync();
        }
    }
}
