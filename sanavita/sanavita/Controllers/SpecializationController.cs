using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/Specializations")]
    [ApiController]
    public class SpecializationController : Controller
    {
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IMapper _mapper;

        public SpecializationController(ISpecializationRepository specializationRepository, IMapper mapper)
        {
            _specializationRepository = specializationRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Specialization>))]
        public IActionResult GetSpecializations()
        {
            var specializations = _specializationRepository.GetSpecializations();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(specializations);
        }

        [HttpGet("{spezId}")]
        [ProducesResponseType(200, Type = typeof(Specialization))]
        [ProducesResponseType(400)]
        public IActionResult GetSpecialization(int spezId)
        {
            if (!_specializationRepository.SpecializationExists(spezId))
                return NotFound();

            var specialization = _specializationRepository.GetSpecialization(spezId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(specialization);
        }

        [HttpGet("doctors/{spezId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Doctor>))]
        [ProducesResponseType(400)]
        public IActionResult GetDoctorsBySpecialization(int spezId)
        {
            if (!_specializationRepository.SpecializationExists(spezId))
                return NotFound();

            var doctors = _mapper.Map<List<DoctorDto>>(_specializationRepository.GetDoctorsBySpecialization(spezId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(doctors);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateSpecialization([FromBody] Specialization specializationCreate)
        {
            if (specializationCreate == null)
                return BadRequest(ModelState);

            var specialization = _specializationRepository.GetSpecializations()
                .Where(e => e.Name == specializationCreate.Name).FirstOrDefault();

            if (specialization != null)
            {
                ModelState.AddModelError("", "Specialization with this name already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_specializationRepository.CreateSpecialization(specializationCreate))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{spezId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateSpecialization(int spezId, [FromBody] Specialization specializationUpdate)
        {
            if (specializationUpdate == null || specializationUpdate.SpecializationId != spezId)
                return BadRequest(ModelState);

            if (!_specializationRepository.SpecializationExists(spezId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            if (!_specializationRepository.UpdateSpecialization(specializationUpdate))
            {
                ModelState.AddModelError("", "Something went wrong updating specialization");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{spezId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteSpecialization(int spezId)
        {
            if (!_specializationRepository.SpecializationExists(spezId))
                return NotFound();

            var specializationToDelete = _specializationRepository.GetSpecialization(spezId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_specializationRepository.DeleteSpecialization(specializationToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting specialization");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
