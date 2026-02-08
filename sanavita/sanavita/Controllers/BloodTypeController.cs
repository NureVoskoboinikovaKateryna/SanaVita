using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/BloodTypes")]
    [ApiController]
    public class BloodTypeController : Controller
    {
        private readonly IBloodTypeRepository _bloodTypeRepository;
        private readonly IMapper _mapper;

        public BloodTypeController(IBloodTypeRepository bloodTypeRepository, IMapper mapper)
        {
            _bloodTypeRepository = bloodTypeRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<BloodType>))]
        public IActionResult GetBloodTypes()
        {
            var bloodTypes = _bloodTypeRepository.GetBloodTypes();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(bloodTypes);
        }

        [HttpGet("{btypeId}")]
        [ProducesResponseType(200, Type = typeof(BloodType))]
        [ProducesResponseType(400)]
        public IActionResult GetBloodType(int btypeId)
        {
            var bloodType = _bloodTypeRepository.GetBloodType(btypeId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(bloodType);
        }

        [HttpGet("patients/{btypeId}")]
        [Authorize]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Patient>))]
        [ProducesResponseType(400)]
        public IActionResult GetPatientsByBloodType(int btypeId)
        {
            var patients = _mapper.Map<List<PatientDto>>(_bloodTypeRepository.GetPatientsByBloodType(btypeId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patients);
        }
    }
}
