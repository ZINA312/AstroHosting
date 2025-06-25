using AstroHosting.API.ViewModels.Equipment;
using AstroHosting.Application.DTOs.Equipment;
using AutoMapper;

namespace AstroHosting.API.MappingProfiles
{
    public class EquipmentProfile : Profile
    {
        public EquipmentProfile()
        {
            CreateMap<EquipmentVm, EquipmentDto>();

            CreateMap<EquipmentDto, EquipmentVm>();

            CreateMap<EquipmentCreateVm, EquipmentCreateDto>();

            CreateMap<EquipmentUpdateVm, EquipmentUpdateDto>();
        }
    }
}
