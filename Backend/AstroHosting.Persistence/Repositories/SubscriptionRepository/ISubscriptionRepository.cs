using AstroHosting.Core.Entities;

namespace AstroHosting.Persistence.Repositories.SubscriptionRepository
{
    public interface ISubscriptionRepository : IRepository<Subscription>
    {
        Task<Subscription?> GetBySubscriberAndTargetUserAsync(Guid subscriberId, Guid targetUserId);
        Task<IEnumerable<Subscription>> GetSubscriptionsMadeByUserAsync(Guid subscriberId);
        Task<IEnumerable<Subscription>> GetSubscriptionsReceivedByUserAsync(Guid targetUserId);
        Task<Subscription?> GetByIdWithUserAsync(Guid id);
    }
}
