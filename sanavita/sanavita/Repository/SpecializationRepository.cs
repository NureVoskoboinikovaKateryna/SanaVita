using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;

namespace sanavita.Repository
{
    public class SpecializationRepository : ISpecializationRepository
    {
        private readonly DataContext _context;

        public SpecializationRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateSpecialization(Specialization specialization)
        {
            _context.Add(specialization);
            return Save();
        }

        public bool DeleteSpecialization(Specialization specialization)
        {
            _context.Remove(specialization);
            return Save();
        }

        public ICollection<Doctor> GetDoctorsBySpecialization(int spezId)
        {
            return _context.Doctors.Where(e => e.Specialization.SpecializationId == spezId).ToList();
        }

        public Specialization GetSpecialization(int spezId)
        {
            return _context.Specializations.Where(e => e.SpecializationId == spezId).FirstOrDefault();
        }

        public ICollection<Specialization> GetSpecializations()
        {
            return _context.Specializations.OrderBy(e => e.SpecializationId).ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool SpecializationExists(int spezId)
        {
            return _context.Specializations.Any(e => e.SpecializationId == spezId);
        }

        public bool UpdateSpecialization(Specialization specialization)
        {
            _context.Update(specialization);
            return Save();
        }
    }
}
