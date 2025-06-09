using AstroHosting.Application.DTOs.Subscription;
using AstroHosting.Core.Entities;
using AutoMapper;

namespace AstroHosting.Application.MappingProfiles
{
    public class SubscriptionProfile : Profile
    {
        public SubscriptionProfile()
        {
            CreateMap<Subscription, SubscriptionDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Subscriber, opt => opt.MapFrom(src => src.Subscriber))
                .ForMember(dest => dest.TargetUser, opt => opt.MapFrom(src => src.TargetUser))
                .ForMember(dest => dest.SubscriptionDate, opt => opt.MapFrom(src => src.SubscriptionDate));

            CreateMap<SubscriptionCreateDto, Subscription>()
                .ForMember(dest => dest.TargetUserId, opt => opt.MapFrom(src => src.TargetUserId))
                .ForMember(dest => dest.SubscriptionDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.SubscriberId, opt => opt.MapFrom(src => src.SubscriberId))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Subscriber, opt => opt.Ignore())
                .ForMember(dest => dest.TargetUser, opt => opt.Ignore());
        }
    }
}
