using AstroHosting.API.ViewModels.Comment;
using AstroHosting.Application.DTOs.Comment;
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
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IMapper _mapper;
        private readonly ILogger<CommentController> _logger;

        public CommentController(ICommentService commentService, IMapper mapper, ILogger<CommentController> logger)
        {
            _commentService = commentService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet("post/{postId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCommentsForPost(Guid postId)
        {
            try
            {
                _logger.LogInformation("Attempting to retrieve comments for post: {PostId}", postId);
                var commentDtos = await _commentService.GetCommentsByPostAsync(postId);
                var commentVms = _mapper.Map<IEnumerable<CommentVm>>(commentDtos);
                _logger.LogInformation("Successfully retrieved {Count} comments for post: {PostId}", commentVms.Count(), postId);
                return Ok(commentVms);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to retrieve comments: {Message}", ex.Message);
                return NotFound(new { error = ex.Message }); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving comments for post {PostId}", postId);
                return StatusCode(500, new { error = "An internal server error occurred." }); 
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateComment([FromBody] CommentCreateVm createVm)
        {
            try
            {
                var userId = GetCurrentUserId();
                var createDto = _mapper.Map<CommentCreateDto>(createVm);
                createDto.UserId = userId;

                _logger.LogInformation("Attempting to create comment for post {PostId} by user {UserId}", createDto.PostId, createDto.UserId);
                var createdCommentDto = await _commentService.CreateCommentAsync(createDto);
                var resultVm = _mapper.Map<CommentVm>(createdCommentDto);

                _logger.LogInformation("Comment {CommentId} successfully created for post {PostId}", resultVm.Id, resultVm.PostId);
                return CreatedAtAction(nameof(GetCommentsForPost), new { postId = resultVm.PostId }, resultVm);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to create comment: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message }); 
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error during comment creation: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message, ex.Errors });
            }
            catch (InvalidOperationException ex) 
            {
                _logger.LogError(ex, "Authentication error: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." }); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while creating comment.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateComment(Guid id, [FromBody] CommentUpdateVm updateVm)
        {
            try
            {
                var userId = GetCurrentUserId();
                var updateDto = _mapper.Map<CommentUpdateDto>(updateVm);
                updateDto.CommentId = id;
                updateDto.UserId = userId;

                _logger.LogInformation("Attempting to update comment {CommentId} by user {UserId}", id, userId);
                await _commentService.UpdateCommentAsync(updateDto);
                _logger.LogInformation("Comment {CommentId} successfully updated", id);
                return NoContent(); 
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Update error: {Message}", ex.Message);
                return NotFound(new { error = ex.Message }); 
            }
            catch (ForbiddenException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to update comment: {Message}", ex.Message);
                return Forbid(); 
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error during comment update: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message, ex.Errors });
            }
            catch (InvalidOperationException ex) 
            {
                _logger.LogError(ex, "Authentication error: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." }); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while updating comment {CommentId}", id);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var deleteDto = new CommentDeleteDto() { UserId = userId, CommentId = id };

                _logger.LogInformation("Attempting to delete comment {CommentId} by user {UserId}", id, userId);
                await _commentService.DeleteCommentAsync(deleteDto);
                _logger.LogInformation("Comment {CommentId} successfully deleted", id);
                return NoContent(); 
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Delete error: {Message}", ex.Message);
                return NotFound(new { error = ex.Message }); 
            }
            catch (ForbiddenException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to delete comment: {Message}", ex.Message);
                return Forbid(); 
            }
            catch (InvalidOperationException ex) 
            {
                _logger.LogError(ex, "Authentication error: {Message}", ex.Message);
                return Unauthorized(new { error = "Authentication required or invalid token." }); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while deleting comment {CommentId}", id);
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