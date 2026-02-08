using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.EntityFrameworkCore;

namespace sanavita.Repository
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly DataContext _context;

        public DoctorRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateDoctor(Doctor doctor)
        {
            _context.Add(doctor);
            return Save();
        }

        public bool DeleteDoctor(Doctor doctor)
        {
            _context.Remove(doctor);
            return Save();
        }

        public bool DoctorExists(int doctorId)
        {
            return _context.Doctors.Any(e => e.DoctorId == doctorId);
        }

        public bool DoctorExistsByEmail(string email)
        {
            return _context.Doctors.Any(e => e.ApplicationUser.Email == email);
        }

        public Doctor GetDoctor(int doctorId)
        {
            return _context.Doctors
                .Include(e => e.ApplicationUser)
                .Include(e => e.Specialization)
                .Where(e => e.DoctorId == doctorId)
                .FirstOrDefault();
        }

        public Doctor GetDoctorByEmail(string email)
        {
            return _context.Doctors
                .Include(e => e.ApplicationUser)
                .Include(e => e.Specialization)
                .Where(e => e.ApplicationUser.Email == email)
                .FirstOrDefault();
        }

        public ICollection<Doctor> GetDoctors()
        {
            return _context.Doctors
                .Include(e => e.Specialization)
                .Include(e => e.ApplicationUser)
                .OrderBy(e => e.DoctorId)
                .ToList();
        }

        public ICollection<MedicalRecord> GetMedicalRecordsByDoctor(int doctorId)
        {
            return _context.MedicalRecords.Where(e => e.DoctorId == doctorId).ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateDoctor(Doctor doctor)
        {
            _context.Update(doctor);
            return Save();
        }
    }
}
