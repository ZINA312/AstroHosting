using AstroHosting.Application.DTOs.Search;

namespace AstroHosting.Application.Services
{
    public interface ISearchService
    {
        Task<SearchResponseDto> GlobalSearchAsync(string searchTerm);
    }
}