using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface IMedicalDeviceRepository
    {
        ICollection<MedicalDevice> GetMedicalDevices();
        ICollection<MedicalDevice> GetMedicalDevicesByType(int mdevicetypeId);
        MedicalDevice GetMedicalDevice(int mdeviceId);
        bool MedicalDeviceExists(int mdeviceId);
        bool CreateMedicalDevice(MedicalDevice medicalDevice);
        bool UpdateMedicalDevice(MedicalDevice medicalDevice);
        bool DeleteMedicalDevice(MedicalDevice medicalDevice);
        bool Save();
    }
}
