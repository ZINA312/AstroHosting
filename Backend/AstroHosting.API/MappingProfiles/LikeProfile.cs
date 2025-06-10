using AstroHosting.API.ViewModels.Like;
using AstroHosting.Application.DTOs.Like;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class LikeProfile : Profile
    {
        public LikeProfile()
        {
            CreateMap<LikeVm, LikeDto>();

            CreateMap<LikeDto, LikeVm>();

            CreateMap<LikeCreateVm, LikeCreateDto>();
        }
    }
}
