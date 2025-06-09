using AstroHosting.API.ViewModels.Like;
using AstroHosting.Application.DTOs.Like;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class LikeProfile : Profile
    {
        public LikeProfile()
        {
            CreateMap<LikeVm, LikeDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .ForMember(dest => dest.PostId, opt => opt.MapFrom(src => Guid.Parse(src.PostId)))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

            CreateMap<LikeDto, LikeVm>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.PostId, opt => opt.MapFrom(src => src.PostId.ToString()))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

            CreateMap<LikeCreateVm, LikeCreateDto>()
                .ForMember(dest => dest.PostId, opt => opt.MapFrom(src => Guid.Parse(src.PostId)));
        }
    }
}
