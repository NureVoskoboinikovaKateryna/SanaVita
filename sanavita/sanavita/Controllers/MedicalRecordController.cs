using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/MedicalRecords")]
    [ApiController]
    public class MedicalRecordController : Controller
    {
        private readonly IMedicalRecordRepository _medicalRecordRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMapper _mapper;

        public MedicalRecordController(
            IMedicalRecordRepository medicalRecordRepository, 
            IPatientRepository patientRepository,
            IDoctorRepository doctorRepository,
            IMapper mapper)
        {
            _medicalRecordRepository = medicalRecordRepository;
            _patientRepository = patientRepository;
            _doctorRepository = doctorRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalRecord>))]
        public IActionResult GetMedicalRecords()
        {
            var medicalRecords = _mapper.Map<List<MedicalRecordDto>>(_medicalRecordRepository.GetMedicalRecords());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalRecords);
        }

        [HttpGet("{mrecordId}")]
        [ProducesResponseType(200, Type = typeof(MedicalRecord))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicalRecord(int mrecordId)
        {
            if (!_medicalRecordRepository.MedicalRecordExists(mrecordId))
                return NotFound();

            var medicalRecord = _mapper.Map<MedicalRecordDto>(_medicalRecordRepository.GetMedicalRecord(mrecordId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalRecord);
        }

        [HttpGet("patient/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalRecord>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicalRecordsByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var medicalRecords = _mapper.Map<List<MedicalRecordDto>>(
                _medicalRecordRepository.GetMedicalRecordsByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalRecords);
        }

        [HttpGet("patient/{patientId}/doctor/{doctorId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalRecord>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicalRecordsByPatient(int patientId, int doctorId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            var medicalRecords = _mapper.Map<List<MedicalRecordDto>>(
                _medicalRecordRepository.GetMedicalRecordsByPatientAndDoctor(patientId, doctorId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalRecords);
        }

        [HttpGet("doctor/{doctorId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<MedicalRecord>))]
        [ProducesResponseType(400)]
        public IActionResult GetMedicalRecordsByDoctor(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            var medicalRecords = _mapper.Map<List<MedicalRecordDto>>(
                _medicalRecordRepository.GetMedicalRecordsByDoctor(doctorId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(medicalRecords);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateMedicalRecord(
            [FromQuery] int doctorId,
            [FromQuery] int patientId,
            [FromBody] MedicalRecordDto medicalRecordCreate)
        {
            if (medicalRecordCreate == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            var medicalRecordMap = _mapper.Map<MedicalRecord>(medicalRecordCreate);
            medicalRecordMap.Patient = _patientRepository.GetPatient(patientId);
            medicalRecordMap.Doctor = _doctorRepository.GetDoctor(doctorId);

            if (!_medicalRecordRepository.CreateMedicalRecord(medicalRecordMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{mrecordId}")]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateMedicalRecord(int mrecordId, [FromBody] MedicalRecordDto medicalRecordUpdate)
        {
            if (medicalRecordUpdate == null || medicalRecordUpdate.MedicalRecordId != mrecordId)
                return BadRequest(ModelState);

            if (!_medicalRecordRepository.MedicalRecordExists(mrecordId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var medicalRecordMap = _mapper.Map<MedicalRecord>(medicalRecordUpdate);
            if (!_medicalRecordRepository.UpdateMedicalRecord(medicalRecordMap))
            {
                ModelState.AddModelError("", "Something went wrong updating medical record");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{mrecordId}")]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteMedicalRecord(int mrecordId)
        {
            if (!_medicalRecordRepository.MedicalRecordExists(mrecordId))
                return NotFound();

            var medicalRecordToDelete = _medicalRecordRepository.GetMedicalRecord(mrecordId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_medicalRecordRepository.DeleteMedicalRecord(medicalRecordToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting medical record");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
