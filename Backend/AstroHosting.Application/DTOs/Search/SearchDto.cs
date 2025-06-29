using AstroHosting.Application.DTOs.User;
using AstroHosting.Application.DTOs.Post;
using AstroHosting.Application.DTOs.Equipment;

namespace AstroHosting.Application.DTOs.Search
{
    public class SearchResponseDto
    {
        public IEnumerable<UserShortDto> Users { get; set; } = [];
        public IEnumerable<PostDto> Posts { get; set; } = [];
        public IEnumerable<EquipmentDto> Equipment { get; set; } = [];
    }
}