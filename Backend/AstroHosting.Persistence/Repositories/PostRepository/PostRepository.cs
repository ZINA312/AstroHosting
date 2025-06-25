using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Persistence.Repositories.PostRepository
{
    public class PostRepository : BaseRepository<Post>, IPostRepository
    {
        public PostRepository(AstroHostingDBContext dbcontext, ILogger<Post> logger) : base(dbcontext, logger) { }

        public async Task<Post?> GetPostByIdWithDetailsAsync(
            Guid id,
            bool includeDeleted = false,
            Guid? requesterId = null,
            bool includeComments = false,
            bool includeLikes = false,
            bool includeEquipment = false)
        {
            IQueryable<Post> query = _entities.AsQueryable();

            if (!includeDeleted)
            {
                query = query.Where(p => !p.IsDeleted);
            }
            else 
            {
                query = query.Where(p => !p.IsDeleted || (p.IsDeleted && p.AuthorId == requesterId));
            }

            query = query.Include(p => p.Author);

            if (includeComments)
            {
                query = query.Include(p => p.Comments);
            }
            if (includeLikes)
            {
                query = query.Include(p => p.Likes).ThenInclude(l => l.User);
            }
            if (includeEquipment)
            {
                query = query.Include(p => p.EquipmentUsed).ThenInclude(pe => pe.Equipment);
            }

            return await query.FirstOrDefaultAsync(p => p.Id == id);
        }


        public async Task<IEnumerable<Post>> GetNonDeletedPostsAsync() 
        {
            return await _entities
                .Where(p => !p.IsDeleted)
                .Include(p => p.Author)
                .Include(p => p.Comments)
                .Include(p => p.Likes)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetSoftDeletedPostsByAuthorIdAsync(Guid authorId) 
        {
            return await _entities
                .Where(p => p.IsDeleted && p.AuthorId == authorId)
                .Include(p => p.Author)
                .Include(p => p.Comments)
                .Include(p => p.Likes)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetNonDeletedPostsByAuthorIdAsync(Guid authorId) 
        {
            return await _entities
                .Where(p => !p.IsDeleted && p.AuthorId == authorId)
                .Include(p => p.Author)
                .Include(p => p.Comments)
                .Include(p => p.Likes)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPopularPostsAsync(int count) 
        {
            return await _entities
                .Where(p => !p.IsDeleted) 
                .Include(p => p.Author)
                .Include(p => p.Comments)
                .Include(p => p.Likes) 
                .OrderByDescending(p => p.Likes.Count) 
                .Take(count)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetAllPostsAsync(
            bool includeDeleted = false,
            Guid? requesterId = null) 
        {
            IQueryable<Post> query = _entities.AsQueryable();

            if (!includeDeleted)
            {
                query = query.Where(p => !p.IsDeleted);
            }
            else 
            {
                query = query.Where(p => !p.IsDeleted || (requesterId.HasValue && p.IsDeleted && p.AuthorId == requesterId.Value));
            }


            query = query.Include(p => p.Author)
                         .Include(p => p.Comments)
                         .Include(p => p.Likes);

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<Post?> GetByIdEvenIfDeletedAsync(Guid id)
        {
            return await _entities.FirstOrDefaultAsync(p => p.Id == id);
        }

        public new async Task<Post?> GetByIdAsync(Guid id)
        {
            return await _entities.FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
        }

    }
}
