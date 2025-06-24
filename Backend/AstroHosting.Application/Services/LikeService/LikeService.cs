using AstroHosting.Application.DTOs.Like;
using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Repositories.LikeRepository;
using AstroHosting.Persistence.Repositories.PostRepository;
using AutoMapper;
using Microsoft.Extensions.Logging;
using AstroHosting.Application.Exceptions;

namespace AstroHosting.Application.Services
{
    public class LikeService : ILikeService
    {
        private readonly ILikeRepository _likeRepository;
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<LikeService> _logger;

        public LikeService(ILikeRepository likeRepository, IPostRepository postRepository,
            IMapper mapper, ILogger<LikeService> logger)
        {
            _likeRepository = likeRepository;
            _postRepository = postRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<LikeDto> CreateLikeAsync(LikeCreateDto createDto)
        {
            _logger.LogInformation("Attempting to create like for Post {PostId} by User {UserId}", createDto.PostId, createDto.UserId);

            var postExists = await _postRepository.ExistsAsync(createDto.PostId);
            if (!postExists)
            {
                _logger.LogWarning("Post with ID {PostId} not found when creating like.", createDto.PostId);
                throw new NotFoundException("Post", createDto.PostId);
            }

            var existingLike = await _likeRepository.GetByUserIdAndPostIdAsync(createDto.UserId, createDto.PostId);
            if (existingLike != null)
            {
                _logger.LogWarning("User {UserId} has already liked Post {PostId}.", createDto.UserId, createDto.PostId);
                throw new ValidationException("This user has already liked this post.",
                    new Dictionary<string, string[]> { { "Like", new[] { "A like from this user to this post already exists." } } });
            }

            var newLike = _mapper.Map<Like>(createDto);
            await _likeRepository.AddAsync(newLike);
            _logger.LogInformation("Like by User {UserId} for Post {PostId} added. Like ID: {LikeId}", createDto.UserId, createDto.PostId, newLike.Id);

            var createdLikeWithUser = await _likeRepository.GetByIdWithUserAsync(newLike.Id);
            return _mapper.Map<LikeDto>(createdLikeWithUser);
        }

        public async Task DeleteLikeAsync(LikeDeleteDto deleteDto)
        {
            _logger.LogInformation("Attempting to delete like on post {PostId} by User {UserId}", deleteDto.PostId, deleteDto.UserId);

            var like = await _likeRepository.GetByUserIdAndPostIdAsync(deleteDto.UserId, deleteDto.PostId);
            if (like == null)
            {
                _logger.LogWarning("Like by User {UserId} on Post {PostId} not found for deletion.", deleteDto.UserId, deleteDto.PostId);
                throw new NotFoundException("Like", $"for user {deleteDto.UserId} on post {deleteDto.PostId}");
            }

            if (like.UserId != deleteDto.UserId)
            {
                _logger.LogWarning("User {UserId} attempted to delete another user's like on post {PostId}", deleteDto.UserId, deleteDto.PostId);
                throw new ForbiddenException();
            }

            await _likeRepository.DeleteAsync(like);
            _logger.LogInformation("Like by User {UserId} on Post {PostId} successfully deleted.", deleteDto.UserId, deleteDto.PostId);
        }


        public async Task<IEnumerable<LikeDto>> GetLikesForPostAsync(Guid postId)
        {
            var postExists = await _postRepository.ExistsAsync(postId);
            if (!postExists)
            {
                _logger.LogWarning("Post not found when retrieving likes: {PostId}", postId);
                throw new NotFoundException("Post", postId);
            }
            var likes = await _likeRepository.GetLikesByPostIdWithUserAsync(postId);
            return _mapper.Map<IEnumerable<LikeDto>>(likes);
        }

        public async Task<LikeDto> GetLikeByIdAsync(Guid id)
        {
            _logger.LogInformation("Retrieving like by ID: {LikeId}", id);
            var like = await _likeRepository.GetByIdWithUserAsync(id);
            if (like == null)
            {
                _logger.LogWarning("Like with ID {LikeId} not found.", id);
                throw new NotFoundException("Like", id);
            }
            return _mapper.Map<LikeDto>(like);
        }
    }
}
