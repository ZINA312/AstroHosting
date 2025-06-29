using AstroHosting.Application.DTOs.Search;
using AstroHosting.Application.DTOs.User;
using AstroHosting.Application.DTOs.Post;
using AstroHosting.Application.DTOs.Equipment;
using AstroHosting.Persistence.Repositories.UserRepository;
using AstroHosting.Persistence.Repositories.PostRepository;
using AstroHosting.Persistence.Repositories.EquipmentRepository;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace AstroHosting.Application.Services
{
    public class SearchService : ISearchService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPostRepository _postRepository;
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<SearchService> _logger;

        public SearchService(
            IUserRepository userRepository,
            IPostRepository postRepository,
            IEquipmentRepository equipmentRepository,
            IMapper mapper,
            ILogger<SearchService> logger)
        {
            _userRepository = userRepository;
            _postRepository = postRepository;
            _equipmentRepository = equipmentRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<SearchResponseDto> GlobalSearchAsync(string searchTerm)
        {
            var users = await _userRepository.SearchUsersAsync(searchTerm);
            var posts = await _postRepository.SearchPostsAsync(searchTerm);
            var equipment = await _equipmentRepository.SearchEquipmentAsync(searchTerm);

            var userDtos = _mapper.Map<IEnumerable<UserShortDto>>(users); 
            var postDtos = _mapper.Map<IEnumerable<PostDto>>(posts);
            var equipmentDtos = _mapper.Map<IEnumerable<EquipmentDto>>(equipment);

            return new SearchResponseDto
            {
                Users = userDtos,
                Posts = postDtos,
                Equipment = equipmentDtos
            };
        }
    }
}