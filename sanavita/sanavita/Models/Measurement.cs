namespace sanavita.Models
{
    public class Measurement
    {
        public int MeasurementId { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public float MeasurementValue { get; set; }
        public MedicalDevice MedicalDevice { get; set; }
        public DateTime MeasurementDate { get; set; } = DateTime.UtcNow;
    }
}
