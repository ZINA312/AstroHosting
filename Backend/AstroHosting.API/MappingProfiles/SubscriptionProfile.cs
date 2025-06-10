using AstroHosting.API.ViewModels.Subscription;
using AstroHosting.Application.DTOs.Subscription;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class SubscriptionProfile : Profile
    {
        public SubscriptionProfile()
        {
            CreateMap<SubscriptionVm, SubscriptionDto>();

            CreateMap<SubscriptionDto, SubscriptionVm>();

            CreateMap<SubscriptionCreateVm, SubscriptionCreateDto>();
        }
    }
}
