using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface IManufacturerRepository
    {
        ICollection<Manufacturer> GetManufacturers();
        Manufacturer GetManufacturer(int manfId);
        ICollection<MedicalDevice> GetMedicalDevicesByManufacturer(int manfId);
        bool ManufacturerExists(int manfId);
        bool CreateManufacturer(Manufacturer manufacturer);
        bool UpdateManufacturer(Manufacturer manufacturer);
        bool DeleteManufacturer(Manufacturer manufacturer);
        bool Save();
    }
}
