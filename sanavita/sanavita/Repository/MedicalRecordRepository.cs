using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;

namespace sanavita.Repository
{
    public class MedicalRecordRepository : IMedicalRecordRepository
    {
        private readonly DataContext _context;

        public MedicalRecordRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateMedicalRecord(MedicalRecord medicalRecord)
        {
            _context.Add(medicalRecord);
            return Save();
        }

        public bool DeleteMedicalRecord(MedicalRecord medicalRecord)
        {
            _context.Remove(medicalRecord);
            return Save();
        }

        public MedicalRecord GetMedicalRecord(int mrecordId)
        {
            return _context.MedicalRecords.Where(e => e.MedicalRecordId == mrecordId).FirstOrDefault();
        }

        public ICollection<MedicalRecord> GetMedicalRecords()
        {
            return _context.MedicalRecords.OrderBy(e => e.MedicalRecordId).ToList();
        }

        public ICollection<MedicalRecord> GetMedicalRecordsByDoctor(int doctorId)
        {
            return _context.MedicalRecords.Where(e => e.DoctorId == doctorId).ToList();
        }

        public ICollection<MedicalRecord> GetMedicalRecordsByPatient(int patientId)
        {
            return _context.MedicalRecords.Where(e => e.PatientId == patientId).ToList();
        }

        public ICollection<MedicalRecord> GetMedicalRecordsByPatientAndDoctor(int patientId, int doctorId)
        {
            return _context.MedicalRecords
                .Where(e => (e.PatientId == patientId && e.DoctorId == doctorId))
                .ToList();
        }

        public bool MedicalRecordExists(int mrecordId)
        {
            return _context.MedicalRecords.Any(e => e.MedicalRecordId == mrecordId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateMedicalRecord(MedicalRecord medicalRecord)
        {
            _context.Update(medicalRecord);
            return Save();
        }
    }
}
