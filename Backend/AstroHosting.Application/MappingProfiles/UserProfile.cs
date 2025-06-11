using AstroHosting.Application.DTOs.User;
using AstroHosting.Core.Entities;
using AutoMapper;

namespace AstroHosting.Application.MappingProfiles
{
    public class UserProfile : Profile
    {
        public UserProfile() 
        {
            CreateMap<User, UserShortDto>();

            CreateMap<User, UserProfileDto>()
                .ForMember(dest => dest.PostCount, opt => opt.MapFrom(src => src.Posts.Count(p => !p.IsDeleted)))
                .ForMember(dest => dest.SubscribersCount, opt => opt.MapFrom(src => src.SubscriptionsReceived.Count))
                .ForMember(dest => dest.SubscriptionsCount, opt => opt.MapFrom(src => src.SubscriptionsMade.Count))
                .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => src.DateCreated));
            
            CreateMap<UserUpdateDto, User>()
                .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UserRegisterDto, User>()
                .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}
