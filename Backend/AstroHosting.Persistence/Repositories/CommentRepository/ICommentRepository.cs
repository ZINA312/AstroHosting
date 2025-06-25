using AstroHosting.Core.Entities;

namespace AstroHosting.Persistence.Repositories.CommentRepository
{
    public interface ICommentRepository : IRepository<Comment>
    {
        Task<IEnumerable<Comment>> GetByPostIdWithUserAsync(Guid postId);
        Task<Comment?> GetByIdWithUserAsync(Guid commentId);
    }
}
