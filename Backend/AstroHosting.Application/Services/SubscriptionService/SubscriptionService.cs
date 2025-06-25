using AstroHosting.Application.DTOs.Subscription;
using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Repositories.SubscriptionRepository;
using AstroHosting.Persistence.Repositories.UserRepository; 
using AutoMapper;
using Microsoft.Extensions.Logging;
using AstroHosting.Application.Exceptions;

namespace AstroHosting.Application.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IUserRepository _userRepository; 
        private readonly IMapper _mapper;
        private readonly ILogger<SubscriptionService> _logger;

        public SubscriptionService(
            ISubscriptionRepository subscriptionRepository,
            IUserRepository userRepository,
            IMapper mapper,
            ILogger<SubscriptionService> logger)
        {
            _subscriptionRepository = subscriptionRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<SubscriptionDto> CreateSubscriptionAsync(SubscriptionCreateDto createDto)
        {
            _logger.LogInformation("Attempting to create subscription: Subscriber {SubscriberId} to Target {TargetUserId}", 
                createDto.SubscriberId, 
                createDto.TargetUserId);

            var errors = new Dictionary<string, string[]>();

            if (createDto.SubscriberId == createDto.TargetUserId)
            {
                errors.Add("Subscription", ["A user cannot subscribe to themselves."]);
            }

            var subscriberExists = await _userRepository.ExistsAsync(createDto.SubscriberId);
            if (!subscriberExists)
            {
                errors.Add(nameof(createDto.SubscriberId), [$"Subscriber with ID {createDto.SubscriberId} not found."]);
            }

            var targetUserExists = await _userRepository.ExistsAsync(createDto.TargetUserId);
            if (!targetUserExists)
            {
                errors.Add(nameof(createDto.TargetUserId), [$"Target user with ID {createDto.TargetUserId} not found."]);
            }

            if (errors.Count != 0)
            {
                _logger.LogWarning("Subscription creation failed due to validation errors. Subscriber {SubscriberId} to Target {TargetUserId}. Errors: {Errors}",
                    createDto.SubscriberId, createDto.TargetUserId,
                    string.Join("; ", errors.SelectMany(e => e.Value)));
                throw new ValidationException("Subscription validation failed.", errors);
            }

            var existingSubscription = await _subscriptionRepository.GetBySubscriberAndTargetUserAsync(createDto.SubscriberId, createDto.TargetUserId);
            if (existingSubscription != null)
            {
                _logger.LogWarning("Subscription already exists: Subscriber {SubscriberId} to Target {TargetUserId}", 
                    createDto.SubscriberId,
                    createDto.TargetUserId);
                throw new ValidationException("Subscription already exists.", 
                    new Dictionary<string, string[]> { { "Subscription", new[] { "This subscription already exists." } } });
            }

            var subscription = _mapper.Map<Subscription>(createDto);
            await _subscriptionRepository.AddAsync(subscription);
            _logger.LogInformation("Subscription {SubscriptionId} created: Subscriber {SubscriberId} to Target {TargetUserId}",
                subscription.Id,
                createDto.SubscriberId,
                createDto.TargetUserId);

            var createdSubscriptionWithUsers = await _subscriptionRepository.GetByIdWithUserAsync(subscription.Id);
            return _mapper.Map<SubscriptionDto>(createdSubscriptionWithUsers);
        }

        public async Task DeleteSubscriptionAsync(SubscriptionDeleteDto deleteDto)
        {
            _logger.LogInformation("Attempting to delete subscription by Subscriber {SubscriberId} for Target {TargetUserId}",
                deleteDto.SubscriberId,
                deleteDto.TargetUserId);

            var subscription = await _subscriptionRepository.GetBySubscriberAndTargetUserAsync(deleteDto.SubscriberId, deleteDto.TargetUserId);
            if (subscription == null)
            {
                _logger.LogWarning("Subscription by Subscriber {SubscriberId} to Target {TargetUserId} not found for deletion.",
                    deleteDto.SubscriberId, deleteDto.TargetUserId);
                throw new NotFoundException("Subscription", $"from user {deleteDto.SubscriberId} to user {deleteDto.TargetUserId}");
            }

            if (subscription.SubscriberId != deleteDto.SubscriberId)
            {
                _logger.LogWarning("User {SubscriberId} attempted to delete another user's subscription (Target: {TargetUserId})",
                    deleteDto.SubscriberId,
                    deleteDto.TargetUserId);
                throw new ForbiddenException();
            }

            await _subscriptionRepository.DeleteAsync(subscription);
            _logger.LogInformation("Subscription by Subscriber {SubscriberId} to Target {TargetUserId} successfully deleted.",
                deleteDto.SubscriberId, deleteDto.TargetUserId);
        }

        public async Task<SubscriptionDto> GetSubscriptionByIdAsync(Guid id)
        {
            _logger.LogInformation("Retrieving subscription by ID: {SubscriptionId}", id);
            var subscription = await _subscriptionRepository.GetByIdWithUserAsync(id);
            if (subscription == null)
            {
                _logger.LogWarning("Subscription with ID {SubscriptionId} not found.", id);
                throw new NotFoundException("Subscription", id);
            }
            return _mapper.Map<SubscriptionDto>(subscription);
        }

        public async Task<IEnumerable<SubscriptionDto>> GetSubscriptionsMadeByUserAsync(Guid subscriberId)
        {
            _logger.LogInformation("Retrieving subscriptions made by user: {SubscriberId}", subscriberId);
            var subscriberExists = await _userRepository.ExistsAsync(subscriberId);
            if (!subscriberExists)
            {
                _logger.LogWarning("Subscriber with ID {SubscriberId} not found when retrieving their subscriptions.", subscriberId);
                throw new NotFoundException("User", subscriberId);
            }
            var subscriptions = await _subscriptionRepository.GetSubscriptionsMadeByUserAsync(subscriberId);
            return _mapper.Map<IEnumerable<SubscriptionDto>>(subscriptions);
        }

        public async Task<IEnumerable<SubscriptionDto>> GetSubscriptionsReceivedByUserAsync(Guid targetUserId)
        {
            _logger.LogInformation("Retrieving subscriptions received by user: {TargetUserId}", targetUserId);
            var targetUserExists = await _userRepository.ExistsAsync(targetUserId);
            if (!targetUserExists)
            {
                _logger.LogWarning("Target user with ID {TargetUserId} not found when retrieving their followers.", targetUserId);
                throw new NotFoundException("User", targetUserId);
            }
            var subscriptions = await _subscriptionRepository.GetSubscriptionsReceivedByUserAsync(targetUserId);
            return _mapper.Map<IEnumerable<SubscriptionDto>>(subscriptions);
        }

        public async Task<bool> IsSubscribedAsync(Guid subscriberId, Guid targetUserId)
        {
            _logger.LogInformation("Checking subscription status: Subscriber {SubscriberId} to Target {TargetUserId}",
                subscriberId, 
                targetUserId);

            var subscriberExists = await _userRepository.ExistsAsync(subscriberId);
            var targetUserExists = await _userRepository.ExistsAsync(targetUserId);

            if (!subscriberExists) throw new NotFoundException("User", subscriberId);
            if (!targetUserExists) throw new NotFoundException("User", targetUserId);

            var subscription = await _subscriptionRepository.GetBySubscriberAndTargetUserAsync(subscriberId, targetUserId);
            return subscription != null;
        }
    }
}
