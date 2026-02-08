namespace sanavita.Models
{
    public class MedicalDevice
    {
        public int MedicalDeviceId { get; set; }
        public int ProductionYear { get; set; }
        public int ManufacturerId { get; set; }
        public Manufacturer Manufacturer { get; set; }
        public int MedicalDeviceTypeId { get; set; }
        public MedicalDeviceType MedicalDeviceType { get; set; }
    }
}
