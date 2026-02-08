namespace sanavita.Models
{
    public class Manufacturer
    {
        public int ManufacturerId { get; set; }
        public string Name { get; set; }
        public ICollection<MedicalDevice> MedicalDevices { get; set; }
    }
}
