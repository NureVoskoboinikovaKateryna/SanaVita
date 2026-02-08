using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/Notifications")]
    [ApiController]
    public class NotificationController : Controller
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMapper _mapper;

        public NotificationController(
            INotificationRepository notificationRepository,
            IPatientRepository patientRepository,
            IDoctorRepository doctorRepository,
            IMapper mapper)
        {
            _notificationRepository = notificationRepository;
            _patientRepository = patientRepository;
            _doctorRepository = doctorRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Notification>))]
        public IActionResult GetNotifications()
        {
            var notifications = _mapper.Map<List<NotificationDto>>(_notificationRepository.GetNotifications());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(notifications);
        }

        [HttpGet("{notifId}")]
        [ProducesResponseType(200, Type = typeof(Notification))]
        [ProducesResponseType(400)]
        public IActionResult GetNotification(int notifId)
        {
            if (!_notificationRepository.NotificationExists(notifId))
                return NotFound();

            var notification = _mapper.Map<NotificationDto>(_notificationRepository.GetNotification(notifId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(notification);
        }

        [HttpGet("patient/{patientId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Notification>))]
        [ProducesResponseType(400)]
        public IActionResult GetNotificationsByPatient(int patientId)
        {
            if (!_patientRepository.PatientExists(patientId))
                return NotFound();

            var notifications = _mapper.Map<List<NotificationDto>>(_notificationRepository.GetNotificationsByPatient(patientId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(notifications);
        }

        [HttpGet("doctor/{doctorId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Notification>))]
        [ProducesResponseType(400)]
        public IActionResult GetNotificationsByDoctor(int doctorId)
        {
            if (!_doctorRepository.DoctorExists(doctorId))
                return NotFound();

            var notifications = _mapper.Map<List<NotificationDto>>(_notificationRepository.GetNotificationsByDoctor(doctorId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(notifications);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateNotification([FromBody] NotificationDto notificationCreate)
        {
            if (notificationCreate == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            var notificationMap = _mapper.Map<Notification>(notificationCreate);

            if (notificationCreate.SenderType == UserType.Doctor && !_doctorRepository.DoctorExists(notificationCreate.SenderId))
                return NotFound($"Doctor with ID {notificationCreate.SenderId} not found");

            if (notificationCreate.ReceiverType == UserType.Patient && !_patientRepository.PatientExists(notificationCreate.ReceiverId))
                return NotFound($"Patient with ID {notificationCreate.ReceiverId} not found");


            if (!_notificationRepository.CreateNotification(notificationMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{notifId}")]
        [Authorize(Roles = "Administrator,Doctor")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateNotification(int notifId, [FromBody] NotificationDto notificationUpdate)
        {
            if (notificationUpdate == null || notificationUpdate.NotificationId != notifId)
                return BadRequest(ModelState);

            if (!_notificationRepository.NotificationExists(notifId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var notificationMap = _mapper.Map<Notification>(notificationUpdate);
            if (!_notificationRepository.UpdateNotification(notificationMap))
            {
                ModelState.AddModelError("", "Something went wrong updating notification");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{notifId}")]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteNotification(int notifId)
        {
            if (!_notificationRepository.NotificationExists(notifId))
                return NotFound();

            var notificationToDelete = _notificationRepository.GetNotification(notifId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_notificationRepository.DeleteNotification(notificationToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting notification");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}