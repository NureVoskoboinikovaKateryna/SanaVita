namespace sanavita.Models
{
    public class MedicalDeviceType
    {
        public int MedicalDeviceTypeId { get; set; }
        public string Name { get; set; }
        public ICollection<MedicalDevice> MedicalDevices { get; set; }
    }
}
