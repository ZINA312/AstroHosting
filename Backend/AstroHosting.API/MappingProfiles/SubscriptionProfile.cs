using AstroHosting.API.ViewModels.Subscription;
using AstroHosting.Application.DTOs.Subscription;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class SubscriptionProfile : Profile
    {
        public SubscriptionProfile()
        {
            CreateMap<SubscriptionVm, SubscriptionDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .ForMember(dest => dest.SubscriptionDate, opt => opt.MapFrom(src => DateTime.Parse(src.SubscriptionDate)))
                .ForMember(dest => dest.Subscriber, opt => opt.MapFrom(src => src.Subscriber))
                .ForMember(dest => dest.TargetUser, opt => opt.MapFrom(src => src.TargetUser));

            CreateMap<SubscriptionDto, SubscriptionVm>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.SubscriptionDate, opt => opt.MapFrom(src => src.SubscriptionDate.ToString("o")))
                .ForMember(dest => dest.Subscriber, opt => opt.MapFrom(src => src.Subscriber))
                .ForMember(dest => dest.TargetUser, opt => opt.MapFrom(src => src.TargetUser));

            CreateMap<SubscriptionCreateVm, SubscriptionCreateDto>()
                .ForMember(dest => dest.TargetUserId, opt => opt.MapFrom(src => Guid.Parse(src.TargetUserId)));
        }
    }
}
