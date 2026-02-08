using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/MedicalDeviceTypes")]
    [ApiController]
    public class MedicalDeviceTypeController : Controller
    {
        private readonly IMedicalDeviceTypeRepository _medicalDeviceTypeRepository;
        private readonly IMapper _mapper;

        public MedicalDeviceTypeController(IMedicalDeviceTypeRepository medicalDeviceTypeRepository, IMapper mapper)
        {
            _medicalDeviceTypeRepository = medicalDeviceTypeRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalDeviceType>))]
        public IActionResult GetMedicalDeviceTypes()
        {
            var medicalDeviceTypes = _medicalDeviceTypeRepository.GetMedicalDeviceTypes();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalDeviceTypes);
        }

        [HttpGet("{mdevicetypeId}")]
        [ProducesResponseType(200, Type = typeof(MedicalDeviceType))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicalDeviceType(int mdevicetypeId)
        {
            if (!_medicalDeviceTypeRepository.MedicalDeviceTypeExists(mdevicetypeId))
                return NotFound();

            var medicalDeviceType = _medicalDeviceTypeRepository.GetMedicalDeviceType(mdevicetypeId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalDeviceType);
        }

        [HttpGet("mdevices/{mdevicetypeId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalDevice>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicalDevicesByType(int mdevicetypeId)
        {
            if (!_medicalDeviceTypeRepository.MedicalDeviceTypeExists(mdevicetypeId))
                return NotFound();

            var medicalDevices = _mapper.Map<List<MedicalDeviceDto>>(_medicalDeviceTypeRepository.GetMedicalDevicesByType(mdevicetypeId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalDevices);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateMedicalDeviceType([FromBody] MedicalDeviceTypeDto medicalDeviceTypeCreate)
        {
            if (medicalDeviceTypeCreate == null)
                return BadRequest(ModelState);

            var medicalDeviceType = _medicalDeviceTypeRepository.GetMedicalDeviceTypes()
                .Where(e => e.Name == medicalDeviceTypeCreate.Name).FirstOrDefault();

            if (medicalDeviceType != null)
            {
                ModelState.AddModelError("", "Medical device type with this name already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var medicalDeviceTypeMap = _mapper.Map<MedicalDeviceType>(medicalDeviceTypeCreate);
            if (!_medicalDeviceTypeRepository.CreateMedicalDeviceType(medicalDeviceTypeMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{mdevicetypeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateMedicalDeviceType(
            int mdevicetypeId, 
            [FromBody] MedicalDeviceTypeDto medicalDeviceTypeUpdate)
        {
            if (medicalDeviceTypeUpdate == null || medicalDeviceTypeUpdate.MedicalDeviceTypeId != mdevicetypeId)
                return BadRequest(ModelState);

            if (!_medicalDeviceTypeRepository.MedicalDeviceTypeExists(mdevicetypeId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var medicalDeviceTypeMap = _mapper.Map<MedicalDeviceType>(medicalDeviceTypeUpdate);
            if (!_medicalDeviceTypeRepository.UpdateMedicalDeviceType(medicalDeviceTypeMap))
            {
                ModelState.AddModelError("", "Something went wrong updating medical device type");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{mdevicetypeId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteMedicalDeviceType(int mdevicetypeId)
        {
            if (!_medicalDeviceTypeRepository.MedicalDeviceTypeExists(mdevicetypeId))
                return NotFound();

            var medicalDeviceTypeToDelete = _medicalDeviceTypeRepository.GetMedicalDeviceType(mdevicetypeId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_medicalDeviceTypeRepository.DeleteMedicalDeviceType(medicalDeviceTypeToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting medical device type");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
