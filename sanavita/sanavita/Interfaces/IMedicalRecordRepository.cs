using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface IMedicalRecordRepository
    {
        ICollection<MedicalRecord> GetMedicalRecords();
        MedicalRecord GetMedicalRecord(int mrecordId);
        ICollection<MedicalRecord> GetMedicalRecordsByPatient(int patientId);
        ICollection<MedicalRecord> GetMedicalRecordsByDoctor(int doctorId);
        ICollection<MedicalRecord> GetMedicalRecordsByPatientAndDoctor(int patientId, int doctorId);
        bool MedicalRecordExists(int mrecordId);
        bool CreateMedicalRecord(MedicalRecord medicalRecord);
        bool UpdateMedicalRecord(MedicalRecord medicalRecord);
        bool DeleteMedicalRecord(MedicalRecord medicalRecord);
        bool Save();
    }
}
