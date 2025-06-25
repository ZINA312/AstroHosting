using AstroHosting.Application.DTOs.Comment;

namespace AstroHosting.Application.Services
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentDto>> GetCommentsByPostAsync(Guid postId);
        Task<CommentDto> CreateCommentAsync(CommentCreateDto createDto);
        Task UpdateCommentAsync(CommentUpdateDto updateDto);
        Task DeleteCommentAsync(CommentDeleteDto deleteDto);
    }
}
