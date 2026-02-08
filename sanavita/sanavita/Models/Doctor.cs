namespace sanavita.Models
{
    public class Doctor
    {
        public int DoctorId { get; set; }
        public Specialization Specialization { get; set; }
        public ICollection<MedicalRecord> MedicalRecords { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
