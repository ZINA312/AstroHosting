using AstroHosting.API.ViewModels.Equipment;
using AstroHosting.Application.DTOs.Equipment;
using AstroHosting.Core.Entities;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class EquipmentProfile : Profile
    {
        public EquipmentProfile()
        {
            CreateMap<EquipmentVm, EquipmentDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse<EquipmentTypes>(src.Type)));

            CreateMap<EquipmentDto, EquipmentVm>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));

            CreateMap<EquipmentCreateVm, EquipmentCreateDto>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse<EquipmentTypes>(src.Type)));
        }
    }
}
