using AstroHosting.Core.Entities;

namespace AstroHosting.Persistence.Repositories.LikeRepository
{
    public interface ILikeRepository : IRepository<Like>
    {
        Task<Like?> GetByUserIdAndPostIdAsync(Guid userId, Guid postId);
        Task<IEnumerable<Like>> GetLikesByPostIdWithUserAsync(Guid postId);
        Task<Like?> GetByIdWithUserAsync(Guid id);
    }
}
