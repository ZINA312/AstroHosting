using AstroHosting.API.ViewModels.Post;
using AstroHosting.Application.DTOs.Post;
using AstroHosting.Application.Exceptions;
using AstroHosting.Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace AstroHosting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly IMapper _mapper;
        private readonly ILogger<PostController> _logger;

        public PostController(IPostService postService, IMapper mapper, ILogger<PostController> logger)
        {
            _postService = postService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllNonDeletedPosts() 
        {
            try
            {
                var postDtos = await _postService.GetNonDeletedPostsAsync(); 
                var postVms = _mapper.Map<IEnumerable<PostVm>>(postDtos);
                return Ok(postVms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving all non-deleted posts.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("deleted")] 
        [Authorize]
        public async Task<IActionResult> GetMySoftDeletedPosts()
        {
            try
            {
                var userId = GetCurrentUserId();
                var postDtos = await _postService.GetSoftDeletedPostsForUserAsync(userId); 
                var postVms = _mapper.Map<IEnumerable<PostVm>>(postDtos);
                return Ok(postVms);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during retrieving deleted posts: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving soft-deleted posts.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("user/{authorId}")] 
        [AllowAnonymous]
        public async Task<IActionResult> GetPostsByAuthor(Guid authorId)
        {
            try
            {
                var postDtos = await _postService.GetPostsByAuthorIdAsync(authorId); 
                var postVms = _mapper.Map<IEnumerable<PostVm>>(postDtos);
                return Ok(postVms);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to retrieve posts by author: {Message}", ex.Message);
                return NotFound(new { error = ex.Message }); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving posts by author {AuthorId}.", authorId);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("popular")] 
        [AllowAnonymous]
        public async Task<IActionResult> GetPopularPosts([FromQuery] int count = 10)
        {
            try
            {
                var postDtos = await _postService.GetPopularPostsAsync(count);
                var postVms = _mapper.Map<IEnumerable<PostVm>>(postDtos);
                return Ok(postVms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving popular posts.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("equipment/{equipmentId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPostsByEquipmentId(Guid equipmentId)
        {
            try
            {
                var postDtos = await _postService.GetPostsByEquipmentIdAsync(equipmentId);
                var postVms = _mapper.Map<IEnumerable<PostVm>>(postDtos);
                return Ok(postVms);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to retrieve posts by equipment ID: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving posts by equipment ID {EquipmentId}.", equipmentId);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPostDetailsById(Guid id, [FromQuery] bool includeDeleted = false)
        {
            try
            {
                Guid? requesterId = GetCurrentUserIdOrDefault();
                var postDetailsDto = await _postService.GetPostDetailsByIdAsync(id, includeDeleted, requesterId);
                var postDetailsVm = _mapper.Map<PostDetailsVm>(postDetailsDto);
                return Ok(postDetailsVm);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to retrieve post: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving post {PostId}.", id);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpPost]
        [Authorize]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreatePost([FromForm] PostCreateVm createVm)
        {
            try
            {
                var authorId = GetCurrentUserId();
                _logger.LogInformation("Attempting to create new post for Author {AuthorId} with title: {Title}",
                    authorId,
                     createVm.Title);

                var createDto = _mapper.Map<PostCreateDto>(createVm);
                createDto.AuthorId = authorId;

                if (createVm.ImageFile != null)
                {
                    using (var stream = new MemoryStream())
                    {
                        createDto.ImageFileStream = createVm.ImageFile.OpenReadStream();
                        createDto.ImageFileName = createVm.ImageFile.FileName;
                    }
                }

                var createdPostDto = await _postService.CreatePostAsync(createDto);
                var resultVm = _mapper.Map<PostVm>(createdPostDto);

                _logger.LogInformation("Post {PostId} successfully created for Author {AuthorId}.",
                    resultVm.Id,
                    resultVm.Author.Id);
                return CreatedAtAction(nameof(GetPostDetailsById), new { id = resultVm.Id }, resultVm);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to create post (related entity not found): {Message}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error during post creation: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message, errors = ex.Errors });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during post creation: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while creating post.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePost(Guid id, [FromBody] PostUpdateVm updateVm)
        {
            try
            {
                var authorId = GetCurrentUserId();
                _logger.LogInformation("Attempting to update post {PostId} by Author {AuthorId}", id, authorId);

                var updateDto = _mapper.Map<PostUpdateDto>(updateVm);
                updateDto.Id = id;
                updateDto.AuthorId = authorId;

                await _postService.UpdatePostAsync(updateDto);
                _logger.LogInformation("Post {PostId} successfully updated by Author {AuthorId}.", id, authorId);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to update post: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (ForbiddenException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to update post: {Message}", ex.Message);
                return Forbid();
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error during post update: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message, errors = ex.Errors });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during post update: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while updating post {PostId}.", id);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> SoftDeletePost(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogInformation("Attempting to soft delete post {PostId} by User {UserId}", id, userId);

                var deleteDto = new PostDeleteDto { PostId = id, UserId = userId };
                await _postService.SoftDeletePostAsync(deleteDto);
                _logger.LogInformation("Post {PostId} successfully soft-deleted by User {UserId}.", id, userId);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to soft delete post: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (ForbiddenException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to soft delete post: {Message}", ex.Message);
                return Forbid();
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Soft delete validation error: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during soft post deletion: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while soft deleting post {PostId}.", id);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpDelete("hard/{id}")]
        [Authorize]
        public async Task<IActionResult> HardDeletePost(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogWarning("Attempting to PERMANENTLY delete post {PostId} by User {UserId}. This action is irreversible.",
                    id, 
                    userId);

                await _postService.HardDeletePostAsync(id, userId);
                _logger.LogInformation("Post {PostId} successfully hard-deleted by User {UserId}.", id, userId);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to hard delete post: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (ForbiddenException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to hard delete post: {Message}", ex.Message);
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Authentication error during hard post deletion: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while hard deleting post {PostId}.", id);
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
