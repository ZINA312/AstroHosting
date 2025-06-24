using AstroHosting.API.ViewModels.Equipment;
using AstroHosting.Application.DTOs.Equipment;
using AstroHosting.Application.Exceptions;
using AstroHosting.Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AstroHosting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _equipmentService;
        private readonly IMapper _mapper;
        private readonly ILogger<EquipmentController> _logger;

        public EquipmentController(IEquipmentService equipmentService, IMapper mapper, ILogger<EquipmentController> logger)
        {
            _equipmentService = equipmentService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous] 
        public async Task<IActionResult> GetAllEquipment()
        {
            try
            {
                var equipmentDtos = await _equipmentService.GetAllEquipmentAsync();
                var equipmentVms = _mapper.Map<IEnumerable<EquipmentVm>>(equipmentDtos);
                return Ok(equipmentVms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving all equipment.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous] 
        public async Task<IActionResult> GetEquipmentById(Guid id)
        {
            try
            {
                var equipmentDto = await _equipmentService.GetEquipmentByIdAsync(id);
                var equipmentVm = _mapper.Map<EquipmentVm>(equipmentDto);
                return Ok(equipmentVm);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Failed to retrieve equipment: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while retrieving equipment {EquipmentId}.", id);
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateEquipment([FromBody] EquipmentCreateVm createVm)
        {
            try
            {
                _logger.LogInformation("Attempting to create new equipment.");
                var createDto = _mapper.Map<EquipmentCreateDto>(createVm);
                var createdEquipmentDto = await _equipmentService.CreateEquipmentAsync(createDto);
                var resultVm = _mapper.Map<EquipmentVm>(createdEquipmentDto);

                _logger.LogInformation("Equipment {EquipmentId} successfully created.", resultVm.Id);
                return CreatedAtAction(nameof(GetEquipmentById), new { id = resultVm.Id }, resultVm);
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error during equipment creation: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message, errors = ex.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while creating equipment.");
                return StatusCode(500, new { error = "An internal server error occurred." });
            }
        }

        // Only for admins, but application doesn't have roles

        //[HttpPut("{id}")]
        //[Authorize]
        //public async Task<IActionResult> UpdateEquipment(Guid id, [FromBody] EquipmentUpdateVm updateVm)
        //{
        //    try
        //    {
        //        _logger.LogInformation("Attempting to update equipment {EquipmentId}.", id);
        //        var updateDto = _mapper.Map<EquipmentUpdateDto>(updateVm);
        //        updateDto.Id = id;

        //        await _equipmentService.UpdateEquipmentAsync(updateDto);
        //        _logger.LogInformation("Equipment {EquipmentId} successfully updated.", id);
        //        return NoContent();
        //    }
        //    catch (NotFoundException ex)
        //    {
        //        _logger.LogWarning(ex, "Failed to update equipment: {Message}", ex.Message);
        //        return NotFound(new { error = ex.Message });
        //    }
        //    catch (ValidationException ex)
        //    {
        //        _logger.LogWarning(ex, "Validation error during equipment update: {Message}", ex.Message);
        //        return BadRequest(new { error = ex.Message, errors = ex.Errors });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "An internal server error occurred while updating equipment {EquipmentId}.", id);
        //        return StatusCode(500, new { error = "An internal server error occurred." });
        //    }
        //}

        //[HttpDelete("{id}")]
        //[Authorize]
        //public async Task<IActionResult> DeleteEquipment(Guid id)
        //{
        //    try
        //    {
        //        _logger.LogInformation("Attempting to delete equipment {EquipmentId}.", id);
        //        await _equipmentService.DeleteEquipmentAsync(id);
        //        _logger.LogInformation("Equipment {EquipmentId} successfully deleted.", id);
        //        return NoContent();
        //    }
        //    catch (NotFoundException ex)
        //    {
        //        _logger.LogWarning(ex, "Failed to delete equipment: {Message}", ex.Message);
        //        return NotFound(new { error = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "An internal server error occurred while deleting equipment {EquipmentId}.", id);
        //        return StatusCode(500, new { error = "An internal server error occurred." });
        //    }
        //}
    }
}
