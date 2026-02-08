namespace sanavita.Models
{
    public class Patient
    {
        public int PatientId { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public int Age { get; set; }
        public int Height { get; set; }
        public BloodType BloodType { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; }
        public ICollection<Measurement> Measurements { get; set; }
        public ICollection<MedicalRecord> MedicalRecords { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
