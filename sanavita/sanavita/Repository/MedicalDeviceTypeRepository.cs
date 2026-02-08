using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;

namespace sanavita.Repository
{
    public class MedicalDeviceTypeRepository : IMedicalDeviceTypeRepository
    {
        private readonly DataContext _context;

        public MedicalDeviceTypeRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateMedicalDeviceType(MedicalDeviceType medicalDeviceType)
        {
            _context.Add(medicalDeviceType);
            return Save();
        }

        public bool DeleteMedicalDeviceType(MedicalDeviceType medicalDeviceType)
        {
            _context.Remove(medicalDeviceType);
            return Save();
        }

        public ICollection<MedicalDevice> GetMedicalDevicesByType(int mdevicetypeId)
        {
            return _context.MedicalDevices.Where(e => e.MedicalDeviceTypeId == mdevicetypeId).ToList();
        }

        public MedicalDeviceType GetMedicalDeviceType(int mdevicetypeId)
        {
            return _context.MedicalDeviceTypes.Where(e => e.MedicalDeviceTypeId == mdevicetypeId).FirstOrDefault();
        }

        public ICollection<MedicalDeviceType> GetMedicalDeviceTypes()
        {
            return _context.MedicalDeviceTypes.OrderBy(e => e.MedicalDeviceTypeId).ToList();
        }

        public bool MedicalDeviceTypeExists(int mdevicetypeId)
        {
            return _context.MedicalDeviceTypes.Any(e => e.MedicalDeviceTypeId == mdevicetypeId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateMedicalDeviceType(MedicalDeviceType medicalDeviceType)
        {
            _context.Update(medicalDeviceType);
            return Save();
        }
    }
}
