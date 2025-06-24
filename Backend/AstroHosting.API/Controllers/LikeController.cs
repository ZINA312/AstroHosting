using AstroHosting.API.ViewModels.Like;
using AstroHosting.Application.DTOs.Like;
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
    public class LikeController : ControllerBase
    {
        private readonly ILikeService _likeService;
        private readonly IMapper _mapper;
        private readonly ILogger<LikeController> _logger;

        public LikeController(ILikeService likeService, IMapper mapper, ILogger<LikeController> logger)
        {
            _likeService = likeService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> CreateLike([FromBody] LikeCreateVm createVm)
        {
            try
            {
                var userId = GetCurrentUserId(); 
                _logger.LogInformation("Attempting to create like for Post {PostId} by User {UserId}", createVm.PostId, userId);

                var createDto = _mapper.Map<LikeCreateDto>(createVm);
                createDto.UserId = userId; 

                var createdLikeDto = await _likeService.CreateLikeAsync(createDto);
                var resultVm = _mapper.Map<LikeVm>(createdLikeDto);

                _logger.LogInformation("Like successfully added for Post {PostId} by User {UserId}. Like ID: {LikeId}", createVm.PostId, userId, resultVm.Id);
                return CreatedAtAction(nameof(GetLikeById), new { id = resultVm.Id }, resultVm);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to create like: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error during like creation: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message, errors = ex.Errors });
            }
            catch (InvalidOperationException ex) 
            {
                _logger.LogError(ex, "Authentication error during like creation: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while creating like for Post {PostId}.", createVm.PostId);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpDelete("post/{postId}")] 
        [Authorize]
        public async Task<IActionResult> DeleteLike(Guid postId)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogInformation("Attempting to delete like on post {PostId} by User {UserId}", postId, userId);

                var deleteDto = new LikeDeleteDto { PostId = postId, UserId = userId };

                await _likeService.DeleteLikeAsync(deleteDto);
                _logger.LogInformation("Like by User {UserId} on Post {PostId} successfully deleted.", userId, postId);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to delete like: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (ForbiddenException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to delete like: {Message}", ex.Message);
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during like deletion: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while deleting like on post {PostId}.", postId);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("post/{postId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLikesForPost(Guid postId)
        {
            try
            {
                _logger.LogInformation("Attempting to retrieve likes for post: {PostId}", postId);
                var likeDtos = await _likeService.GetLikesForPostAsync(postId);
                var likeVms = _mapper.Map<IEnumerable<LikeVm>>(likeDtos);
                _logger.LogInformation("Successfully retrieved {Count} likes for post: {PostId}", likeVms.Count(), postId);
                return Ok(likeVms);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to retrieve likes: {Message}", ex.Message);
                return NotFound(new { error = ex.Message }); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving likes for post {PostId}.", postId);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLikeById(Guid id)
        {
            try
            {
                _logger.LogInformation("Attempting to retrieve like by ID: {LikeId}", id);
                var likeDto = await _likeService.GetLikeByIdAsync(id);
                var likeVm = _mapper.Map<LikeVm>(likeDto);
                _logger.LogInformation("Successfully retrieved like {LikeId}.", id);
                return Ok(likeVm);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to retrieve like: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving like {LikeId}.", id);
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
    }
}
