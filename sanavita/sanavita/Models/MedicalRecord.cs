namespace sanavita.Models
{
    public class MedicalRecord
    {
        public int MedicalRecordId { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public DateTime VisitDate { get; set; } = DateTime.UtcNow;
        public string Diagnosis { get; set; }
        public string Medications { get; set; }
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; }
    }
}
