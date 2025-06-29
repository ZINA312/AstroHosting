using AstroHosting.Application.DTOs.Post;

namespace AstroHosting.Application.Services
{
    public interface IPostService
    {
        Task<IEnumerable<PostDto>> GetNonDeletedPostsAsync(); 
        Task<IEnumerable<PostDto>> GetSoftDeletedPostsForUserAsync(Guid userId); 
        Task<IEnumerable<PostDto>> GetPostsByAuthorIdAsync(Guid authorId); 
        Task<IEnumerable<PostDto>> GetPopularPostsAsync(int count = 10);
        Task<IEnumerable<PostDto>> GetPostsByEquipmentIdAsync(Guid equipmentId);
        Task<PostDetailsDto> GetPostDetailsByIdAsync(Guid id, bool includeDeleted = false, Guid? requesterId = null);
        Task<PostDto> CreatePostAsync(PostCreateDto createDto);
        Task UpdatePostAsync(PostUpdateDto updateDto);
        Task SoftDeletePostAsync(PostDeleteDto deleteDto);
        Task HardDeletePostAsync(Guid postId, Guid userId);
    }
}
