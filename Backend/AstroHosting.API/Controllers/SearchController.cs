using AstroHosting.API.ViewModels.Search;
using AstroHosting.Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AstroHosting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;
        private readonly IMapper _mapper;
        private readonly ILogger<SearchController> _logger;

        public SearchController(ISearchService searchService, IMapper mapper, ILogger<SearchController> logger)
        {
            _searchService = searchService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous] 
        public async Task<IActionResult> GlobalSearch([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    _logger.LogWarning("Search term is empty or whitespace.");
                    return BadRequest(new { error = "Search term cannot be empty." });
                }

                var searchResponseDto = await _searchService.GlobalSearchAsync(searchTerm);
                var searchResponseVm = _mapper.Map<SearchResponseVm>(searchResponseDto);

                return Ok(searchResponseVm);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred during global search for term: {SearchTerm}.", searchTerm);
                return StatusCode(500, new { error = "An internal server error occurred while performing search." });
            }
        }
    }
}