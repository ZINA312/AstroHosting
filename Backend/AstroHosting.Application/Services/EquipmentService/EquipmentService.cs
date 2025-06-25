using AstroHosting.Application.DTOs.Equipment;
using AstroHosting.Core.Entities;
using AstroHosting.Persistence.Repositories.EquipmentRepository;
using AutoMapper;
using Microsoft.Extensions.Logging;
using AstroHosting.Application.Exceptions;

namespace AstroHosting.Application.Services
{
    public class EquipmentService : IEquipmentService
    {
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<EquipmentService> _logger;

        public EquipmentService(IEquipmentRepository equipmentRepository, IMapper mapper, ILogger<EquipmentService> logger)
        {
            _equipmentRepository = equipmentRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<EquipmentDto>> GetAllEquipmentAsync()
        {
            var equipment = await _equipmentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<EquipmentDto>>(equipment);
        }

        public async Task<EquipmentDto> GetEquipmentByIdAsync(Guid id)
        {
            var equipment = await _equipmentRepository.GetByIdAsync(id);
            if (equipment == null)
            {
                _logger.LogWarning("Equipment with ID {EquipmentId} not found.", id);
                throw new NotFoundException("Equipment", id);
            }
            return _mapper.Map<EquipmentDto>(equipment);
        }

        public async Task<EquipmentDto> CreateEquipmentAsync(EquipmentCreateDto createDto)
        {
            _logger.LogInformation("Attempting to create new equipment: {EquipmentName}", createDto.Name);

            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(createDto.Name))
            {
                errors.Add(nameof(createDto.Name), ["Name is required."]);
            }
            else if (createDto.Name.Length > 100)
            {
                errors.Add(nameof(createDto.Name), ["Name cannot exceed 100 characters."]);
            }

            if (string.IsNullOrWhiteSpace(createDto.Manufacturer))
            {
                errors.Add(nameof(createDto.Manufacturer), ["Manufacturer is required."]);
            }
            else if (createDto.Manufacturer.Length > 100)
            {
                errors.Add(nameof(createDto.Manufacturer), ["Manufacturer cannot exceed 100 characters."]);
            }

            if (errors.Count != 0)
            {
                _logger.LogWarning("Equipment creation failed due to validation errors. Errors: {Errors}",
                    string.Join("; ", errors.SelectMany(e => e.Value)));
                throw new ValidationException("Equipment validation failed.", errors);
            }

            var equipment = _mapper.Map<Equipment>(createDto);
            await _equipmentRepository.AddAsync(equipment);
            _logger.LogInformation("Equipment {EquipmentId} successfully created: {EquipmentName}", 
                equipment.Id,
                equipment.Name);

            return _mapper.Map<EquipmentDto>(equipment);
        }

        public async Task UpdateEquipmentAsync(EquipmentUpdateDto updateDto)
        {
            _logger.LogInformation("Attempting to update equipment {EquipmentId}: {EquipmentName}",
                updateDto.Id,
                updateDto.Name);

            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(updateDto.Name))
            {
                errors.Add(nameof(updateDto.Name), ["Name is required."]);
            }
            else if (updateDto.Name.Length > 100)
            {
                errors.Add(nameof(updateDto.Name), ["Name cannot exceed 100 characters."]);
            }

            if (string.IsNullOrWhiteSpace(updateDto.Manufacturer))
            {
                errors.Add(nameof(updateDto.Manufacturer), ["Manufacturer is required."]);
            }
            else if (updateDto.Manufacturer.Length > 100)
            {
                errors.Add(nameof(updateDto.Manufacturer), ["Manufacturer cannot exceed 100 characters."]);
            }

            if (errors.Count != 0)
            {
                _logger.LogWarning("Equipment update failed due to validation errors for ID {EquipmentId}. Errors: {Errors}",
                    updateDto.Id,
                    string.Join("; ", errors.SelectMany(e => e.Value)));
                throw new ValidationException("Equipment validation failed.", errors);
            }

            var equipment = await _equipmentRepository.GetByIdAsync(updateDto.Id);
            if (equipment == null)
            {
                _logger.LogWarning("Equipment with ID {EquipmentId} not found for update.", updateDto.Id);
                throw new NotFoundException("Equipment", updateDto.Id);
            }

            _mapper.Map(updateDto, equipment); 

            await _equipmentRepository.UpdateAsync(equipment);
            _logger.LogInformation("Equipment {EquipmentId} successfully updated.", updateDto.Id);
        }

        public async Task DeleteEquipmentAsync(Guid id)
        {
            _logger.LogInformation("Attempting to delete equipment by ID: {EquipmentId}", id);

            var equipment = await _equipmentRepository.GetByIdAsync(id);
            if (equipment == null)
            {
                _logger.LogWarning("Equipment with ID {EquipmentId} not found for deletion.", id);
                throw new NotFoundException("Equipment", id);
            }

            await _equipmentRepository.DeleteAsync(equipment);
            _logger.LogInformation("Equipment {EquipmentId} successfully deleted.", id);
        }
    }
}
