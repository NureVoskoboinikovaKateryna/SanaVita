using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface IDoctorRepository
    {
        ICollection<Doctor> GetDoctors();
        Doctor GetDoctor(int doctorId);
        Doctor GetDoctorByEmail(string email);
        ICollection<MedicalRecord> GetMedicalRecordsByDoctor(int doctorId);
        bool DoctorExists(int doctorId);
        bool DoctorExistsByEmail(string email);
        bool CreateDoctor(Doctor doctor);
        bool UpdateDoctor(Doctor doctor);
        bool DeleteDoctor(Doctor doctor);
        bool Save();
    }
}
