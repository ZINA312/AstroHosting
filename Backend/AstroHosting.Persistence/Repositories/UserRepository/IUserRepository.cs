using AstroHosting.Core.Entities;

namespace AstroHosting.Persistence.Repositories.UserRepository
{
    public interface IUserRepository : IRepository<User>
    {
        public Task<User?> GetByLoginAsync(string login);
    }
}
