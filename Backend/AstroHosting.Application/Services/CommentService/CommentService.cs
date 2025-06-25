using AstroHosting.Application.DTOs.Comment;
using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Repositories.CommentRepository;
using AstroHosting.Persistence.Repositories.PostRepository;
using AutoMapper;
using Microsoft.Extensions.Logging;
using AstroHosting.Application.Exceptions;

namespace AstroHosting.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<CommentService> _logger;

        public CommentService(ICommentRepository commentRepository, IPostRepository postRepository,
            IMapper mapper, ILogger<CommentService> logger)
        {
            _commentRepository = commentRepository;
            _postRepository = postRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByPostAsync(Guid postId)
        {
            var postExists = await _postRepository.ExistsAsync(postId);
            if (!postExists)
            {
                _logger.LogWarning("Post not found when retrieving comments: {PostId}", postId);
                throw new NotFoundException("Post", postId);
            }
            var comments = await _commentRepository.GetByPostIdWithUserAsync(postId);
            return _mapper.Map<IEnumerable<CommentDto>>(comments);
        }

        public async Task<CommentDto> CreateCommentAsync(CommentCreateDto createDto)
        {
            _logger.LogInformation("Attempting to create comment for post {PostId} by user {UserId}",
                createDto.PostId,
                createDto.UserId);

            var post = await _postRepository.GetByIdAsync(createDto.PostId);
            if (post == null)
            {
                _logger.LogWarning("Post not found: {PostId}", createDto.PostId);
                throw new NotFoundException("Post", createDto.PostId);
            }

            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(createDto.Text))
            {
                errors.Add(nameof(createDto.Text), ["Comment text is required."]);
            }
            else if (createDto.Text.Length > 500)
            {
                errors.Add(nameof(createDto.Text), ["Comment text cannot exceed 500 characters."]);
            }

            if (errors.Count != 0)
            {
                _logger.LogWarning("Comment creation failed due to validation errors for post {PostId}. Errors: {Errors}",
                    createDto.PostId,
                    string.Join("; ", errors.SelectMany(e => e.Value)));
                throw new ValidationException("Comment validation failed.", errors);
            }

            var comment = _mapper.Map<Comment>(createDto);
            await _commentRepository.AddAsync(comment);
            _logger.LogInformation("Comment {CommentId} successfully created for post {PostId}",
                comment.Id,
                createDto.PostId);

            var createdCommentWithUser = await _commentRepository.GetByIdWithUserAsync(comment.Id);
            return _mapper.Map<CommentDto>(createdCommentWithUser);
        }

        public async Task UpdateCommentAsync(CommentUpdateDto updateDto)
        {
            _logger.LogInformation("Attempting to update comment {CommentId} by user {UserId}",
                updateDto.CommentId,
                updateDto.UserId);

            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(updateDto.Text))
            {
                errors.Add(nameof(updateDto.Text), ["Comment text is required."]);
            }
            else if (updateDto.Text.Length > 500)
            {
                errors.Add(nameof(updateDto.Text), ["Comment text cannot exceed 500 characters."]);
            }

            if (errors.Count != 0)
            {
                _logger.LogWarning("Comment update failed due to validation errors for comment {CommentId}. Errors: {Errors}",
                    updateDto.CommentId, string.Join("; ",
                    errors.SelectMany(e => e.Value)));
                throw new ValidationException("Comment validation failed.", errors);
            }

            var comment = await _commentRepository.GetByIdAsync(updateDto.CommentId);
            if (comment == null)
            {
                _logger.LogWarning("Comment to update not found: {CommentId}", updateDto.CommentId);
                throw new NotFoundException("Comment", updateDto.CommentId);
            }

            if (comment.UserId != updateDto.UserId)
            {
                _logger.LogWarning("User {UserId} attempted to update another user's comment ({CommentId})",
                    updateDto.UserId,
                    updateDto.CommentId);
                throw new ForbiddenException();
            }

            comment.Text = updateDto.Text;
            await _commentRepository.UpdateAsync(comment);
            _logger.LogInformation("Comment {CommentId} successfully updated", updateDto.CommentId);
        }

        public async Task DeleteCommentAsync(CommentDeleteDto deleteDto)
        {
            _logger.LogInformation("Attempting to delete comment {CommentId} by user {UserId}",
                deleteDto.CommentId,
                deleteDto.UserId);

            var comment = await _commentRepository.GetByIdAsync(deleteDto.CommentId);
            if (comment == null)
            {
                _logger.LogWarning("Comment to delete not found: {CommentId}", deleteDto.CommentId);
                throw new NotFoundException("Comment", deleteDto.CommentId);
            }

            if (comment.UserId != deleteDto.UserId)
            {
                _logger.LogWarning("User {UserId} attempted to delete another user's comment ({CommentId})",
                    deleteDto.UserId,
                    deleteDto.CommentId);
                throw new ForbiddenException();
            }

            await _commentRepository.DeleteAsync(comment);
            _logger.LogInformation("Comment {CommentId} successfully deleted", deleteDto.CommentId);
        }
    }
}
