using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sanavita.Models;
using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Dto;
using AutoMapper;

namespace sanavita.Controllers
{
    [ApiController]
    [Route("api/Appointments")]
    public class AppointmentsController : Controller
    {
        private readonly DataContext _context;
        private readonly IEmailService _emailService;

        public AppointmentsController(DataContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AppointmentDto dto)
        {
            var patient = await _context.Patients
                .Include(p => p.ApplicationUser)
                .FirstOrDefaultAsync(p => p.PatientId == dto.PatientId);
            if (patient == null) return NotFound("Пацієнт не знайдений");

            var doctor = await _context.Doctors
                .Include(d => d.ApplicationUser)
                .FirstOrDefaultAsync(d => d.DoctorId == dto.DoctorId);
            if (doctor == null) return NotFound("Лікар не знайдений");

            var appointment = new Appointment
            {
                DoctorId = dto.DoctorId,
                PatientId = dto.PatientId,
                AppointmentDate = dto.AppointmentDate,
                Notes = dto.Notes
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            var doctorFullName = $"{doctor.ApplicationUser.LastName} {doctor.ApplicationUser.Name} {doctor.ApplicationUser.MiddleName}".Trim();

            await _emailService.SendAppointmentEmail(
                patient.ApplicationUser.Email,
                patient.ApplicationUser.Name,
                appointment.AppointmentDate,
                doctorFullName,
                appointment.Notes
            );

            return Ok(new { message = "Appointment created and patient notified" });
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetAppointmentsByDoctor(int doctorId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.ApplicationUser)
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync(); 

            return Ok(appointments);
        }

        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetAppointmentsByPatient(int patientId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Where(a => a.PatientId == patientId)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.ApplicationUser)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound();

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
