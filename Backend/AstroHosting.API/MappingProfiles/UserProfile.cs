using AstroHosting.API.ViewModels.User;
using AstroHosting.Application.DTOs.User;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserShortVm, UserShortDto>();

            CreateMap<UserShortDto, UserShortVm>();

            CreateMap<UserProfileVm, UserProfileDto>();

            CreateMap<UserProfileDto, UserProfileVm>();

            CreateMap<UserUpdateVm, UserUpdateDto>();

            CreateMap<UserRegisterVm, UserRegisterDto>();

            CreateMap<UserAuthVm, UserAuthDto>();
        }
    }
}
