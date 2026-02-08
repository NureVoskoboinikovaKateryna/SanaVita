using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.EntityFrameworkCore;

namespace sanavita.Repository
{
    public class PatientRepository : IPatientRepository
    {
        private readonly DataContext _context;

        public PatientRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreatePatient(Patient patient)
        {
            _context.Add(patient);
            return Save();
        }

        public bool DeletePatient(Patient patient)
        {
            _context.Remove(patient);
            return Save();
        }

        public ICollection<Measurement> GetMeasurementsByPatient(int patientId)
        {
            return _context.Measurements.Where(e => e.PatientId == patientId).ToList();
        }

        public ICollection<MedicalRecord> GetMedicalRecordsByPatient(int patientId)
        {
            return _context.MedicalRecords.Where(e => e.PatientId == patientId).ToList();
        }

        public ICollection<Notification> GetNotificationsByPatient(int patientId)
        {
            return _context.Notifications.Where(e => e.ReceiverId == patientId).ToList();
        }

        public Patient GetPatient(int patientId)
        {
            return _context.Patients
                .Include(e => e.ApplicationUser)
                .Include(e => e.BloodType)
                .Where(e => e.PatientId == patientId)
                .FirstOrDefault();
        }

        public Patient GetPatientByEmail(string email)
        {
            return _context.Patients
                .Include(e => e.ApplicationUser)
                .Include(e => e.BloodType)
                .Where(e => e.ApplicationUser.Email == email)
                .FirstOrDefault();
        }

        public ICollection<Patient> GetPatients()
        {
            return _context.Patients
                .Include(e => e.ApplicationUser)
                .Include(e => e.Company)
                .Include(e => e.BloodType)
                .OrderBy(e => e.PatientId)
                .ToList();
        }

        public ICollection<Patient> GetPatientsByDoctor(int doctorId)
        {
            return _context.MedicalRecords
                .Where(medicalRecord => medicalRecord.DoctorId == doctorId)
                .Include(medicalRecord => medicalRecord.Patient.ApplicationUser)
                .Select(medicalRecord => medicalRecord.Patient)
                .Distinct()
                .ToList();
        }

        public bool PatientExists(int patientId)
        {
            return _context.Patients.Any(e => e.PatientId == patientId);
        }

        public bool PatientExistsByEmail(string email)
        {
            return _context.Patients.Any(e => e.ApplicationUser.Email == email);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdatePatient(Patient patient)
        {
            _context.Update(patient);
            return Save();
        }
    }
}
