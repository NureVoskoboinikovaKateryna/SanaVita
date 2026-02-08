namespace SanaVitaIoT.Models
{
    public class Measurement
    {
        public int MeasurementId { get; set; }
        public int PatientId { get; set; }
        public float MeasurementValue { get; set; }
        public int MedicalDeviceId { get; set; }
        public DateTime MeasurementDate { get; set; } = DateTime.UtcNow;
    }

}
