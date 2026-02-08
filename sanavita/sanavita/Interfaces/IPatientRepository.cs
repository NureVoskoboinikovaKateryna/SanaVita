using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface IPatientRepository
    {
        ICollection<Patient> GetPatients();
        ICollection<Patient> GetPatientsByDoctor(int doctorId);
        Patient GetPatient(int patientId);
        Patient GetPatientByEmail(string email);
        ICollection<Notification> GetNotificationsByPatient(int patientId);
        ICollection<Measurement> GetMeasurementsByPatient(int patientId);
        ICollection<MedicalRecord> GetMedicalRecordsByPatient(int patientId);
        bool PatientExists(int patientId);
        bool PatientExistsByEmail(string email);
        bool CreatePatient(Patient patient);
        bool UpdatePatient(Patient patient);
        bool DeletePatient(Patient patient);
        bool Save();
    }
}
