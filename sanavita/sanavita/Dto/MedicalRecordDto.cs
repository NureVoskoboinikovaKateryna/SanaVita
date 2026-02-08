using sanavita.Models;

namespace sanavita.Dto
{
    public class MedicalRecordDto
    {
        public int MedicalRecordId { get; set; }
        public DateTime VisitDate { get; set; }
        public string Diagnosis { get; set; }
        public string Medications { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
    }
}
