using AstroHosting.Application.DTOs.Equipment;
using AstroHosting.Core.Entities;
using AutoMapper;

namespace AstroHosting.Application.MappingProfiles
{
    public class EquipmentProfile : Profile
    {
        public EquipmentProfile()
        {
            CreateMap<Equipment, EquipmentDto>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString())); ;

            CreateMap<EquipmentCreateDto, Equipment>()
                .ForMember(dest => dest.DateCreated, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(src => DateTime.UtcNow)) 
                .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications ?? new Dictionary<string, string>()));

            CreateMap<EquipmentUpdateDto, Equipment>()
                .ForMember(dest => dest.DateUpdated, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications ?? new Dictionary<string, string>()));
        }
    }
}
