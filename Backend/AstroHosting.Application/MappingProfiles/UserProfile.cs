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
                .ForMember(dest => dest.SubscriptionsCount, opt => opt.MapFrom(src => src.SubscriptionsMade.Count));
            
            CreateMap<UserUpdateDto, User>();
        }
    }
}
