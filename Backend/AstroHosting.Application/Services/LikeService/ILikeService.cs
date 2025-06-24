using AstroHosting.Application.DTOs.Like;

namespace AstroHosting.Application.Services
{
    public interface ILikeService
    {
        Task<LikeDto> CreateLikeAsync(LikeCreateDto createDto);
        Task DeleteLikeAsync(LikeDeleteDto deleteDto);
        Task<IEnumerable<LikeDto>> GetLikesForPostAsync(Guid postId);
        Task<LikeDto> GetLikeByIdAsync(Guid id);
    }
}
