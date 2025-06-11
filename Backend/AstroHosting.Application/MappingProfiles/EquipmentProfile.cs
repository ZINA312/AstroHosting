using AstroHosting.Application.DTOs.Equipment;
using AstroHosting.Core.Entities;
using AutoMapper;

namespace AstroHosting.Application.MappingProfiles
{
    public class EquipmentProfile : Profile
    {
        public EquipmentProfile()
        {
            CreateMap<Equipment, EquipmentDto>();

            CreateMap<EquipmentCreateDto, Equipment>()
                .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications ?? new Dictionary<string, string>()))
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}
