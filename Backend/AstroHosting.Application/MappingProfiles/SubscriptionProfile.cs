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
                .ForMember(dest => dest.SubscriptionDate, opt => opt.MapFrom(src => src.DateCreated));

            CreateMap<SubscriptionCreateDto, Subscription>()
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}