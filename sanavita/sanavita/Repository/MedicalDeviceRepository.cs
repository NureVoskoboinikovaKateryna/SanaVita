using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.EntityFrameworkCore;

namespace sanavita.Repository
{
    public class MedicalDeviceRepository : IMedicalDeviceRepository
    {
        private readonly DataContext _context;

        public MedicalDeviceRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateMedicalDevice(MedicalDevice medicalDevice)
        {
            _context.Add(medicalDevice);
            return Save();
        }

        public bool DeleteMedicalDevice(MedicalDevice medicalDevice)
        {
            _context.Remove(medicalDevice);
            return Save();
        }

        public MedicalDevice GetMedicalDevice(int mdeviceId)
        {
            return _context.MedicalDevices.Where(e => e.MedicalDeviceId == mdeviceId).FirstOrDefault();
        }

        public ICollection<MedicalDevice> GetMedicalDevices()
        {
            return _context.MedicalDevices
                .Include(e => e.MedicalDeviceType)
                .Include(e => e.Manufacturer)
                .OrderBy(e => e.MedicalDeviceId)
                .ToList();
        }

        public ICollection<MedicalDevice> GetMedicalDevicesByType(int mdevicetypeId)
        {
            return _context.MedicalDevices
                .Where(e => e.MedicalDeviceTypeId == mdevicetypeId)
                .Include(e => e.MedicalDeviceType)
                .Include(e => e.Manufacturer)
                .OrderBy(e => e.MedicalDeviceId)
                .ToList();
        }

        public bool MedicalDeviceExists(int mdeviceId)
        {
            return _context.MedicalDevices.Any(e => e.MedicalDeviceId == mdeviceId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateMedicalDevice(MedicalDevice medicalDevice)
        {
            _context.Update(medicalDevice);
            return Save();
        }
    }
}
