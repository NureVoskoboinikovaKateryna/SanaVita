using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/Manufacturers")]
    [ApiController]
    public class ManufacturerController : Controller
    {
        private readonly IManufacturerRepository _manufacturerRepository;
        private readonly IMapper _mapper;

        public ManufacturerController(IManufacturerRepository manufacturerRepository, IMapper mapper)
        {
            _manufacturerRepository = manufacturerRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Manufacturer>))]
        public IActionResult GetManufacturers()
        {
            var manufacturers = _manufacturerRepository.GetManufacturers();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(manufacturers);
        }

        [HttpGet("{manfId}")]
        [ProducesResponseType(200, Type = typeof(Manufacturer))]
        [ProducesResponseType(400)]
        public IActionResult GetManufacturer(int manfId)
        {
            if (!_manufacturerRepository.ManufacturerExists(manfId))
                return NotFound();

            var manufacturer = _manufacturerRepository.GetManufacturer(manfId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(manufacturer);
        }

        [HttpGet("mdevices/{manfId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalDevice>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicalDevicesByManufacturer(int manfId)
        {
            if (!_manufacturerRepository.ManufacturerExists(manfId))
                return NotFound();

            var medicalDevices = _mapper.Map<List<MedicalDeviceDto>>(_manufacturerRepository.GetMedicalDevicesByManufacturer(manfId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalDevices);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateManufacturer([FromBody] ManufacturerDto manufacturerCreate)
        {
            if (manufacturerCreate == null)
                return BadRequest(ModelState);

            var manufacturer = _manufacturerRepository.GetManufacturers()
                .Where(e => e.Name == manufacturerCreate.Name).FirstOrDefault();

            if (manufacturer != null)
            {
                ModelState.AddModelError("", "Manufacturer with this name already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var _manufacturerMap = _mapper.Map<Manufacturer>(manufacturerCreate);
            if (!_manufacturerRepository.CreateManufacturer(_manufacturerMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{manfId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateManufacturer(int manfId, [FromBody] ManufacturerDto manufacturerUpdate)
        {
            if (manufacturerUpdate == null || manufacturerUpdate.ManufacturerId != manfId)
                return BadRequest(ModelState);

            if (!_manufacturerRepository.ManufacturerExists(manfId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var _manufacturerMap = _mapper.Map<Manufacturer>(manufacturerUpdate);
            if (!_manufacturerRepository.UpdateManufacturer(_manufacturerMap))
            {
                ModelState.AddModelError("", "Something went wrong updating manufacturer");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{manfId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteManufacturer(int manfId)
        {
            if (!_manufacturerRepository.ManufacturerExists(manfId))
                return NotFound();

            var manufacturerToDelete = _manufacturerRepository.GetManufacturer(manfId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_manufacturerRepository.DeleteManufacturer(manufacturerToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting manufacturer");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
