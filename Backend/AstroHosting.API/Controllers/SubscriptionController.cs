using AstroHosting.API.ViewModels.Subscription;
using AstroHosting.Application.DTOs.Subscription;
using AstroHosting.Application.Exceptions;
using AstroHosting.Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AstroHosting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;
        private readonly IMapper _mapper;
        private readonly ILogger<SubscriptionController> _logger;

        public SubscriptionController(ISubscriptionService subscriptionService, IMapper mapper, ILogger<SubscriptionController> logger)
        {
            _subscriptionService = subscriptionService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateSubscription([FromBody] SubscriptionCreateVm createVm)
        {
            try
            {
                var subscriberId = GetCurrentUserId(); 
                _logger.LogInformation("Attempting to create subscription: Subscriber {SubscriberId} to Target {TargetUserId}",
                    subscriberId,
                    createVm.TargetUserId);

                var createDto = _mapper.Map<SubscriptionCreateDto>(createVm);
                createDto.SubscriberId = subscriberId; 

                var createdSubscriptionDto = await _subscriptionService.CreateSubscriptionAsync(createDto);
                var resultVm = _mapper.Map<SubscriptionVm>(createdSubscriptionDto);

                _logger.LogInformation("Subscription {SubscriptionId} successfully created.", resultVm.Id);
                return CreatedAtAction(nameof(GetSubscriptionById), new { id = resultVm.Id }, resultVm);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to create subscription (user not found): {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error during subscription creation: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message, errors = ex.Errors });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during subscription creation: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while creating subscription.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpDelete("target/{targetUserId}")] 
        [Authorize]
        public async Task<IActionResult> DeleteSubscription(Guid targetUserId) 
        {
            try
            {
                var subscriberId = GetCurrentUserId(); 
                _logger.LogInformation("Attempting to delete subscription by Subscriber {SubscriberId} for Target {TargetUserId}",
                    subscriberId,
                    targetUserId);

                var deleteDto = new SubscriptionDeleteDto { SubscriberId = subscriberId, TargetUserId = targetUserId };
                await _subscriptionService.DeleteSubscriptionAsync(deleteDto);

                _logger.LogInformation("Subscription by Subscriber {SubscriberId} for Target {TargetUserId} successfully deleted.",
                    subscriberId, targetUserId);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to delete subscription: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (ForbiddenException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to delete subscription: {Message}", ex.Message);
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during subscription deletion: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while deleting subscription by Subscriber and Target IDs." +
                    " Subscriber: {SubscriberId}, Target: {TargetUserId}", 
                    GetCurrentUserIdOrDefault(),
                    targetUserId);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSubscriptionById(Guid id)
        {
            try
            {
                _logger.LogInformation("Retrieving subscription by ID: {SubscriptionId}", id);
                var subscriptionDto = await _subscriptionService.GetSubscriptionByIdAsync(id);
                var subscriptionVm = _mapper.Map<SubscriptionVm>(subscriptionDto);
                _logger.LogInformation("Successfully retrieved subscription {SubscriptionId}.", id);
                return Ok(subscriptionVm);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to retrieve subscription: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving subscription {SubscriptionId}.", id);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("my-following")] 
        [Authorize]
        public async Task<IActionResult> GetMyFollowing()
        {
            try
            {
                var subscriberId = GetCurrentUserId();
                _logger.LogInformation("Retrieving 'following' list for user: {SubscriberId}", subscriberId);
                var subscriptionDtos = await _subscriptionService.GetSubscriptionsMadeByUserAsync(subscriberId);
                var subscriptionVms = _mapper.Map<IEnumerable<SubscriptionVm>>(subscriptionDtos);
                _logger.LogInformation("Successfully retrieved {Count} subscriptions made by user {SubscriberId}.",
                    subscriptionVms.Count(),
                    subscriberId);
                return Ok(subscriptionVms);
            }
            catch (NotFoundException ex) 
            {
                _logger.LogWarning(ex, "User not found when retrieving following list: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during retrieving following list: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving 'following' list.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("followers/{targetUserId}")] 
        [AllowAnonymous] 
        public async Task<IActionResult> GetFollowersForUser(Guid targetUserId)
        {
            try
            {
                _logger.LogInformation("Retrieving 'followers' list for user: {TargetUserId}", targetUserId);
                var subscriptionDtos = await _subscriptionService.GetSubscriptionsReceivedByUserAsync(targetUserId);
                var subscriptionVms = _mapper.Map<IEnumerable<SubscriptionVm>>(subscriptionDtos);
                _logger.LogInformation("Successfully retrieved {Count} subscriptions received by user {TargetUserId}.",
                    subscriptionVms.Count(),
                    targetUserId);
                return Ok(subscriptionVms);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "User not found when retrieving followers list: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving 'followers' list.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("is-subscribed/{targetUserId}")] 
        [Authorize]
        public async Task<IActionResult> IsSubscribed(Guid targetUserId)
        {
            try
            {
                var subscriberId = GetCurrentUserId();
                _logger.LogInformation("Checking if User {SubscriberId} is subscribed to User {TargetUserId}", 
                    subscriberId, 
                    targetUserId);
                var isSubscribed = await _subscriptionService.IsSubscribedAsync(subscriberId, targetUserId);
                return Ok(new { isSubscribed });
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "User not found when checking subscription status: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during subscription status check: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while checking subscription status.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId" || c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
            _logger.LogError("User ID claim not found or is invalid in the token.");
            throw new InvalidOperationException("User ID not found in token. Authentication required.");
        }
        private Guid? GetCurrentUserIdOrDefault()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId" || c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
            return null;
        }
    }
}
