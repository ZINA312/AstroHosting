using AstroHosting.Core.Entities;

namespace AstroHosting.Persistence.Repositories.PostRepository
{
    public interface IPostRepository : IRepository<Post>
    {
        Task<Post?> GetPostByIdWithDetailsAsync(
            Guid id,
            bool includeDeleted = false,
            Guid? requesterId = null,
            bool includeComments = false,
            bool includeLikes = false,
            bool includeEquipment = false);
        Task<IEnumerable<Post>> GetNonDeletedPostsAsync();
        Task<IEnumerable<Post>> GetSoftDeletedPostsByAuthorIdAsync(Guid authorId);
        Task<IEnumerable<Post>> GetNonDeletedPostsByAuthorIdAsync(Guid authorId);
        Task<IEnumerable<Post>> GetPopularPostsAsync(int count);
        Task<IEnumerable<Post>> GetAllPostsAsync(
            bool includeDeleted = false,
            Guid? requesterId = null);
        Task<Post?> GetByIdEvenIfDeletedAsync(Guid id);
        Task<IEnumerable<Post>> SearchPostsAsync(string searchTerm);
        Task<IEnumerable<Post>> GetPostsByEquipmentIdAsync(Guid equipmentId);
    }
}
