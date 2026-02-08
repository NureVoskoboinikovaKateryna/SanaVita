using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;

namespace sanavita.Repository
{
    public class ManufacturerRepository : IManufacturerRepository
    {
        private readonly DataContext _context;

        public ManufacturerRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateManufacturer(Manufacturer manufacturer)
        {
            _context.Add(manufacturer);
            return Save();
        }

        public bool DeleteManufacturer(Manufacturer manufacturer)
        {
            _context.Remove(manufacturer);
            return Save();
        }

        public Manufacturer GetManufacturer(int manfId)
        {
            return _context.Manufacturers.Where(e => e.ManufacturerId == manfId).FirstOrDefault();
        }

        public ICollection<Manufacturer> GetManufacturers()
        {
            return _context.Manufacturers.OrderBy(e => e.ManufacturerId).ToList();
        }

        public ICollection<MedicalDevice> GetMedicalDevicesByManufacturer(int manfId)
        {
            return _context.MedicalDevices.Where(e => e.Manufacturer.ManufacturerId == manfId).ToList();
        }

        public bool ManufacturerExists(int manfId)
        {
            return _context.Manufacturers.Any(e => e.ManufacturerId == manfId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateManufacturer(Manufacturer manufacturer)
        {
            _context.Update(manufacturer);
            return Save();
        }
    }
}
