using AstroHosting.Application.DTOs.Like;
using AstroHosting.Core.Entities;
using AutoMapper;

namespace AstroHosting.Application.MappingProfiles
{
    public class LikeProfile : Profile
    {
        public LikeProfile()
        {
            CreateMap<Like, LikeDto>();

            CreateMap<LikeCreateDto, Like>()
                .ForMember(dest => dest.LikeDate, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}
