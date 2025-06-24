using AstroHosting.Application.DTOs.Post;
using AstroHosting.Core.Entities;
using AstroHosting.Infrastructure.Services;
using AstroHosting.Persistence.Repositories.PostRepository;
using AstroHosting.Persistence.Repositories.UserRepository;
using AstroHosting.Persistence.Repositories.EquipmentRepository;
using AutoMapper;
using Microsoft.Extensions.Logging;
using AstroHosting.Application.Exceptions;

namespace AstroHosting.Application.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;
        private readonly ILogger<PostService> _logger;

        public PostService(
            IPostRepository postRepository,
            IUserRepository userRepository,
            IEquipmentRepository equipmentRepository,
            IFileService fileService,
            IMapper mapper,
            ILogger<PostService> logger)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _equipmentRepository = equipmentRepository;
            _fileService = fileService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<PostDto>> GetNonDeletedPostsAsync() 
        {
            _logger.LogInformation("Retrieving all non-deleted posts.");
            var posts = await _postRepository.GetNonDeletedPostsAsync();
            return _mapper.Map<IEnumerable<PostDto>>(posts);
        }

        public async Task<IEnumerable<PostDto>> GetSoftDeletedPostsForUserAsync(Guid userId) 
        {
            _logger.LogInformation("Retrieving soft-deleted posts for user: {UserId}", userId);
            var posts = await _postRepository.GetSoftDeletedPostsByAuthorIdAsync(userId);
            return _mapper.Map<IEnumerable<PostDto>>(posts);
        }

        public async Task<IEnumerable<PostDto>> GetPostsByAuthorIdAsync(Guid authorId)
        {
            _logger.LogInformation("Retrieving non-deleted posts by author: {AuthorId}", authorId);
            var authorExists = await _userRepository.ExistsAsync(authorId);
            if (!authorExists)
            {
                _logger.LogWarning("Author with ID {AuthorId} not found when retrieving their posts.", authorId);
                throw new NotFoundException("User", authorId);
            }
            var posts = await _postRepository.GetNonDeletedPostsByAuthorIdAsync(authorId);
            return _mapper.Map<IEnumerable<PostDto>>(posts);
        }

        public async Task<IEnumerable<PostDto>> GetPopularPostsAsync(int count = 10)
        {
            _logger.LogInformation("Retrieving {Count} popular posts.", count);
            var posts = await _postRepository.GetPopularPostsAsync(count);
            return _mapper.Map<IEnumerable<PostDto>>(posts);
        }


        public async Task<PostDetailsDto> GetPostDetailsByIdAsync(Guid id, bool includeDeleted = false, Guid? requesterId = null)
        {
            _logger.LogInformation("Retrieving post details for ID: {PostId}. Include Deleted: {IncludeDeleted}, Requester: {RequesterId}",
                id, 
                includeDeleted,
                requesterId);

            var post = await _postRepository.GetPostByIdWithDetailsAsync(
                id,
                includeDeleted: includeDeleted,
                requesterId: requesterId,
                includeComments: true,
                includeLikes: true,
                includeEquipment: true
            );

            if (post == null)
            {
                _logger.LogWarning("Post with ID {PostId} not found (or not accessible as deleted).", id);
                throw new NotFoundException("Post", id);
            }

            return _mapper.Map<PostDetailsDto>(post);
        }

        public async Task<PostDto> CreatePostAsync(PostCreateDto createDto)
        {
            _logger.LogInformation("Attempting to create new post for Author {AuthorId} with title: {Title}", 
                createDto.AuthorId,
                createDto.Title);

            var errors = new Dictionary<string, string[]>();

            var authorExists = await _userRepository.ExistsAsync(createDto.AuthorId);
            if (!authorExists)
            {
                errors.Add(nameof(createDto.AuthorId), [$"Author with ID {createDto.AuthorId} not found."]);
            }

            if (string.IsNullOrWhiteSpace(createDto.Title))
            {
                errors.Add(nameof(createDto.Title), ["Title is required."]);
            }
            else if (createDto.Title.Length > 100)
            {
                errors.Add(nameof(createDto.Title), ["Title cannot exceed 100 characters."]);
            }

            if (createDto.Description != null && createDto.Description.Length > 500)
            {
                errors.Add(nameof(createDto.Description), ["Description cannot exceed 500 characters."]);
            }

            if (createDto.ImageFileStream == null || string.IsNullOrWhiteSpace(createDto.ImageFileName))
            {
                errors.Add(nameof(createDto.ImageFileStream), ["Image file is required."]);
            }
            else if (createDto.ImageFileStream.Length == 0)
            {
                errors.Add(nameof(createDto.ImageFileStream), ["Image file cannot be empty."]);
            }

            var validEquipmentIds = new List<Guid>();
            if (createDto.EquipmentIds != null && createDto.EquipmentIds.Count != 0)
            {
                var uniqueEquipmentIds = createDto.EquipmentIds.Distinct().ToList();
                foreach (var eqId in uniqueEquipmentIds)
                {
                    var equipmentExists = await _equipmentRepository.ExistsAsync(eqId);
                    if (!equipmentExists)
                    {
                        errors.Add(nameof(createDto.EquipmentIds), [$"Equipment with ID {eqId} not found."]);
                    }
                    else
                    {
                        validEquipmentIds.Add(eqId);
                    }
                }
            }

            if (errors.Count != 0)
            {
                _logger.LogWarning("Post creation failed due to validation errors for Author {AuthorId}. Errors: {Errors}", 
                    createDto.AuthorId,
                    string.Join("; ", errors.SelectMany(e => e.Value)));
                throw new ValidationException("Post validation failed.", errors);
            }

            var imageUrl = await _fileService.SaveFileAsync(createDto.ImageFileStream,
                createDto.ImageFileName,
                "uploads/posts");

            var post = _mapper.Map<Post>(createDto);
            post.ImageUrl = imageUrl;

            foreach (var eqId in validEquipmentIds)
            {
                post.EquipmentUsed.Add(new PostEquipment { EquipmentId = eqId });
            }

            await _postRepository.AddAsync(post);
            _logger.LogInformation("Post {PostId} successfully created for Author {AuthorId}", post.Id, post.AuthorId);

            var createdPost = await _postRepository.GetPostByIdWithDetailsAsync(post.Id, includeComments: true,
                includeLikes: true,
                includeEquipment: true);
            return _mapper.Map<PostDto>(createdPost);
        }

        public async Task UpdatePostAsync(PostUpdateDto updateDto)
        {
            _logger.LogInformation("Attempting to update post {PostId} by Author {AuthorId}", updateDto.Id, updateDto.AuthorId);

            var post = await _postRepository.GetPostByIdWithDetailsAsync(
                updateDto.Id,
                includeDeleted: true,
                includeEquipment: true
            );

            if (post == null)
            {
                _logger.LogWarning("Post with ID {PostId} not found for update.", updateDto.Id);
                throw new NotFoundException("Post", updateDto.Id);
            }

            if (post.AuthorId != updateDto.AuthorId)
            {
                _logger.LogWarning("User {AuthorId} attempted to update another user's post ({PostId})", updateDto.AuthorId, updateDto.Id);
                throw new ForbiddenException();
            }

            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(updateDto.Title))
            {
                errors.Add(nameof(updateDto.Title), ["Title is required."]);
            }
            else if (updateDto.Title.Length > 100)
            {
                errors.Add(nameof(updateDto.Title), ["Title cannot exceed 100 characters."]);
            }

            if (updateDto.Description != null && updateDto.Description.Length > 500)
            {
                errors.Add(nameof(updateDto.Description), ["Description cannot exceed 500 characters."]);
            }

            var newEquipmentIds = updateDto.EquipmentIds?.Distinct().ToList() ?? [];

            foreach (var eqId in newEquipmentIds)
            {
                var equipmentExists = await _equipmentRepository.ExistsAsync(eqId);
                if (!equipmentExists)
                {
                    errors.Add(nameof(updateDto.EquipmentIds), [$"Equipment with ID {eqId} not found."]);
                }
            }

            if (errors.Count != 0)
            {
                _logger.LogWarning("Post update failed due to validation errors for Post {PostId}. Errors: {Errors}",
                    updateDto.Id, 
                    string.Join("; ", errors.SelectMany(e => e.Value)));
                throw new ValidationException("Post validation failed.", errors);
            }

            _mapper.Map(updateDto, post);

            if (updateDto.IsDeleted && post.DeletedDate == null)
            {
                post.DeletedDate = DateTime.UtcNow;
            }
            else if (!updateDto.IsDeleted && post.DeletedDate != null)
            {
                post.DeletedDate = null;
            }

            var currentEquipmentLinks = post.EquipmentUsed.ToList();
            var currentEquipmentIds = currentEquipmentLinks.Select(pe => pe.EquipmentId).ToList();

            var equipmentLinksToRemove = currentEquipmentLinks
                .Where(pe => !newEquipmentIds.Contains(pe.EquipmentId))
                .ToList();

            var equipmentIdsToAdd = newEquipmentIds
                .Where(newId => !currentEquipmentIds.Contains(newId))
                .ToList();

            foreach (var linkToRemove in equipmentLinksToRemove)
            {
                post.EquipmentUsed.Remove(linkToRemove);
            }

            foreach (var eqId in equipmentIdsToAdd)
            {
                post.EquipmentUsed.Add(new PostEquipment { PostId = post.Id, EquipmentId = eqId });
            }

            await _postRepository.UpdateAsync(post);
            _logger.LogInformation("Post {PostId} successfully updated by Author {AuthorId}.", post.Id, post.AuthorId);
        }

        public async Task SoftDeletePostAsync(PostDeleteDto deleteDto)
        {
            _logger.LogInformation("Attempting to soft delete post {PostId} by User {UserId}", deleteDto.PostId, deleteDto.UserId);

            var post = await _postRepository.GetPostByIdWithDetailsAsync(deleteDto.PostId, includeDeleted: true);
            if (post == null)
            {
                _logger.LogWarning("Post with ID {PostId} not found for soft deletion.", deleteDto.PostId);
                throw new NotFoundException("Post", deleteDto.PostId);
            }

            if (post.AuthorId != deleteDto.UserId)
            {
                _logger.LogWarning("User {UserId} attempted to soft delete another user's post ({PostId})", deleteDto.UserId, deleteDto.PostId);
                throw new ForbiddenException();
            }

            if (post.IsDeleted)
            {
                _logger.LogWarning("Post with ID {PostId} is already soft-deleted.", deleteDto.PostId);
                throw new ValidationException($"Post with ID {deleteDto.PostId} is already soft-deleted.");
            }

            post.IsDeleted = true;
            post.DeletedDate = DateTime.UtcNow;
            await _postRepository.UpdateAsync(post);
            _logger.LogInformation("Post {PostId} successfully soft-deleted.", deleteDto.PostId);
        }

        public async Task HardDeletePostAsync(Guid postId, Guid userId)
        {
            _logger.LogWarning("Attempting to PERMANENTLY delete post {PostId} by User {UserId}. This action is irreversible.", postId, userId);

            var post = await _postRepository.GetByIdEvenIfDeletedAsync(postId);
            if (post == null)
            {
                _logger.LogWarning("Post with ID {PostId} not found for hard deletion.", postId);
                throw new NotFoundException("Post", postId);
            }

            if (post.AuthorId != userId)
            {
                _logger.LogWarning("User {UserId} attempted to hard delete another user's post ({PostId}).", userId, postId);
                throw new ForbiddenException();
            }

            if (!string.IsNullOrEmpty(post.ImageUrl))
            {
                _fileService.DeleteFile(post.ImageUrl);
                _logger.LogInformation("Associated image file {ImageUrl} deleted for post {PostId}.", post.ImageUrl, postId);
            }

            await _postRepository.DeleteAsync(post);
            _logger.LogInformation("Post {PostId} permanently deleted from database.", postId);
        }
    }
}
