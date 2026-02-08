using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using sanavita.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/Doctors")]
    [ApiController]
    public class DoctorController : Controller
    {
        private readonly ISpecializationRepository _specializationRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMapper _mapper;

        public DoctorController(
            ISpecializationRepository specializationRepository,
            UserManager<ApplicationUser> userManager,
            IDoctorRepository doctorRepository,
            IMapper mapper)
        {
            _specializationRepository = specializationRepository;
            _doctorRepository = doctorRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Doctor>))]
        public IActionResult GetDoctors()
        {
            var doctors = _doctorRepository.GetDoctors();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(doctors);
        }

        [HttpGet("{doctorId}")]
        [ProducesResponseType(200, Type = typeof(Doctor))]
        [ProducesResponseType(400)]
        public IActionResult GetDoctor(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            var doctor = _doctorRepository.GetDoctor(doctorId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(doctor);
        }

        [HttpGet("email/{email}")]
        [ProducesResponseType(200, Type = typeof(Doctor))]
        [ProducesResponseType(400)]
        public IActionResult GetDoctorByEmail(string email)
        {
            if (!_doctorRepository.DoctorExistsByEmail(email))
                return NotFound();

            var doctor = _doctorRepository.GetDoctorByEmail(email);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(doctor);
        }

        [HttpGet("mrecords/{doctorId}")]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalRecord>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicalRecordsByDoctor(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            var medicalRecords = _mapper.Map<List<MedicalRecordDto>>(_doctorRepository.GetMedicalRecordsByDoctor(doctorId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalRecords);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateDoctor(
            [FromBody] DoctorDto doctorCreate)
        {
            if (doctorCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var doctorMap = new Doctor
            {
                DoctorId = doctorCreate.DoctorId
            };
            doctorMap.Specialization = _specializationRepository.GetSpecialization(doctorCreate.SpezId);

            if (!_doctorRepository.CreateDoctor(doctorMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{doctorId}")]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateDoctor(int doctorId, [FromBody] DoctorUPDATE doctorUpdate)
        {
            if (doctorUpdate == null)
                return BadRequest(ModelState);

            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();
            if (!ModelState.IsValid)
                return BadRequest();

            Doctor doctor = _doctorRepository.GetDoctor(doctorId);
            ApplicationUser account = doctor.ApplicationUser;
            account.LastName = doctorUpdate.LastName;
            account.Name = doctorUpdate.Name;
            account.MiddleName = doctorUpdate.MiddleName;
            account.Email = doctorUpdate.Email;
            account.PhoneNumber = doctorUpdate.PhoneNumber;
            _userManager.UpdateAsync(account).Wait();

            doctor.Specialization = _specializationRepository.GetSpecialization(doctorUpdate.SpecializationId);
            doctor.ApplicationUser = account;

            if (!_doctorRepository.UpdateDoctor(doctor))
            {
                ModelState.AddModelError("", "Something went wrong updating doctor");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{doctorId}")]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteDoctor(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            var doctorManagerToDelete = _doctorRepository.GetDoctor(doctorId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_doctorRepository.DeleteDoctor(doctorManagerToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting doctor");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("acc/{doctorId}")]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteDoctorAndAccount(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            Doctor doctorToDelete = _doctorRepository.GetDoctor(doctorId);
            ApplicationUser account = doctorToDelete.ApplicationUser;
            doctorToDelete.ApplicationUser = null;
            _userManager.DeleteAsync(account).Wait();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_doctorRepository.DeleteDoctor(doctorToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patient");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
