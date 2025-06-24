using AstroHosting.Application.DTOs.Subscription;

namespace AstroHosting.Application.Services
{
    public interface ISubscriptionService
    {
        Task<SubscriptionDto> CreateSubscriptionAsync(SubscriptionCreateDto createDto);
        Task DeleteSubscriptionAsync(SubscriptionDeleteDto deleteDto);
        Task<SubscriptionDto> GetSubscriptionByIdAsync(Guid id);
        Task<IEnumerable<SubscriptionDto>> GetSubscriptionsMadeByUserAsync(Guid subscriberId);
        Task<IEnumerable<SubscriptionDto>> GetSubscriptionsReceivedByUserAsync(Guid targetUserId);
        Task<bool> IsSubscribedAsync(Guid subscriberId, Guid targetUserId);
    }
}