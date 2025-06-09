using AstroHosting.API.ViewModels.User;
using AstroHosting.Application.DTOs.User;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserShortVm, UserShortDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)));

            CreateMap<UserShortDto, UserShortVm>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()));

            CreateMap<UserProfileVm, UserProfileDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => DateTime.Parse(src.RegistrationDate)))
                .ForMember(dest => dest.PostCount, opt => opt.MapFrom(src => int.Parse(src.PostCount)))
                .ForMember(dest => dest.SubscribersCount, opt => opt.MapFrom(src => int.Parse(src.SubscribersCount)))
                .ForMember(dest => dest.SubscriptionsCount, opt => opt.MapFrom(src => int.Parse(src.SubscriptionsCount)));

            CreateMap<UserProfileDto, UserProfileVm>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => src.RegistrationDate.ToString("o")))
                .ForMember(dest => dest.PostCount, opt => opt.MapFrom(src => src.PostCount.ToString()))
                .ForMember(dest => dest.SubscribersCount, opt => opt.MapFrom(src => src.SubscribersCount.ToString()))
                .ForMember(dest => dest.SubscriptionsCount, opt => opt.MapFrom(src => src.SubscriptionsCount.ToString()));

            CreateMap<UserUpdateVm, UserUpdateDto>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<UserRegisterVm, UserRegisterDto>();

            CreateMap<UserAuthVm, UserAuthDto>();
        }
    }
}
