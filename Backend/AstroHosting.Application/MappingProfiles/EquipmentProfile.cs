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

            CreateMap<EquipmentCreateDto, Equipment>();
        }
    }
}
