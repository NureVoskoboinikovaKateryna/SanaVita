using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using sanavita.POST;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/Patients")]
    [ApiController]
    public class PatientController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IBloodTypeRepository _bloodTypeRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public PatientController(
            UserManager<ApplicationUser> userManager,
            IBloodTypeRepository bloodTypeRepository,
            ICompanyRepository companyRepository,
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _bloodTypeRepository = bloodTypeRepository;
            _companyRepository = companyRepository;
            _patientRepository = patientRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Patient>))]
        public IActionResult GetPatients()
        {
            var patients = _patientRepository.GetPatients();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patients);
        }

        [HttpGet("{patientId}")]
        [ProducesResponseType(200, Type = typeof(Patient))]
        [ProducesResponseType(400)]
        public IActionResult GetPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var patient = _patientRepository.GetPatient(patientId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patient);
        }

        [HttpGet("email/{email}")]
        [ProducesResponseType(200, Type = typeof(Patient))]
        [ProducesResponseType(400)]
        public IActionResult GetPatientByEmail(string email)
        {
            if (!_patientRepository.PatientExistsByEmail(email))
                return NotFound();

            var patient = _patientRepository.GetPatientByEmail(email);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patient);
        }

        [HttpGet("doctor/{doctorId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Patient>))]
        [ProducesResponseType(400)]
        public IActionResult GetPatientsByDoctor(int doctorId)
        {
            var patients = _patientRepository.GetPatientsByDoctor(doctorId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patients);
        }

        [HttpGet("notifications/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Notification>))]
        [ProducesResponseType(400)]
        public IActionResult GetNotificationsByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var notifications = _mapper.Map<List<NotificationDto>>(_patientRepository.GetNotificationsByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(notifications);
        }

        [HttpGet("measurements/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Measurement>))]
        [ProducesResponseType(400)]
        public IActionResult GetMeasurementsByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var measurements = _mapper.Map<List<MeasurementDto>>(_patientRepository.GetMeasurementsByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(measurements);
        }

        [HttpGet("mrecords/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalRecord>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicalRecordsByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var medicalRecords = _mapper.Map<List<MedicalRecordDto>>(_patientRepository.GetMedicalRecordsByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalRecords);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreatePatient(
            [FromQuery] int companyId,
            [FromQuery] int bloodTypeId,
            [FromBody] PatientPOST patientCreate)
        {
            if (patientCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var patientMap = _mapper.Map<Patient>(patientCreate);
            patientMap.Company = _companyRepository.GetCompany(companyId);
            patientMap.BloodType = _bloodTypeRepository.GetBloodType(bloodTypeId);

            if (!_patientRepository.CreatePatient(patientMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{patientId}")]
        [Authorize(Roles = "Administrator,Patient,CompanyManager")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdatePatient(int patientId, [FromBody] PatientUPDATE patientUpdate)
        {
            if (patientUpdate == null)
                return BadRequest(ModelState);

            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            Patient patient = _patientRepository.GetPatient(patientId);
            ApplicationUser account = patient.ApplicationUser;
            account.LastName = patientUpdate.LastName;
            account.Name = patientUpdate.Name;
            account.MiddleName = patientUpdate.MiddleName;
            account.Email = patientUpdate.Email;
            account.PhoneNumber = patientUpdate.PhoneNumber;
            _userManager.UpdateAsync(account).Wait();

            patient.Address = patientUpdate.Address;
            patient.Age = patientUpdate.Age;
            patient.Height = patientUpdate.Height;
            patient.BloodType = _bloodTypeRepository.GetBloodType(patientUpdate.BTypeId);
            patient.ApplicationUser = account;

            if (!_patientRepository.UpdatePatient(patient))
            {
                ModelState.AddModelError("", "Something went wrong updating patient");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{patientId}")]
        [Authorize(Roles = "Administrator,Patient,CompanyManager")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeletePatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var patientToDelete = _patientRepository.GetPatient(patientId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_patientRepository.DeletePatient(patientToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patient");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("acc/{patientId}")]
        [Authorize(Roles = "Administrator,Patient,CompanyManager")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeletePatientAndAccount(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            Patient patientToDelete = _patientRepository.GetPatient(patientId);
            ApplicationUser account = patientToDelete.ApplicationUser;
            patientToDelete.ApplicationUser = null;
            _userManager.DeleteAsync(account).Wait();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_patientRepository.DeletePatient(patientToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patient");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
