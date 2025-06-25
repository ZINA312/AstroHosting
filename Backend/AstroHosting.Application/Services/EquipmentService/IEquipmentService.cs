using AstroHosting.Application.DTOs.Equipment;

namespace AstroHosting.Application.Services
{
    public interface IEquipmentService
    {
        Task<IEnumerable<EquipmentDto>> GetAllEquipmentAsync();
        Task<EquipmentDto> GetEquipmentByIdAsync(Guid id);
        Task<EquipmentDto> CreateEquipmentAsync(EquipmentCreateDto createDto);
        Task UpdateEquipmentAsync(EquipmentUpdateDto updateDto);
        Task DeleteEquipmentAsync(Guid id);
    }
}
