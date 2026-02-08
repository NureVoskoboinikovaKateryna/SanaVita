using System.ComponentModel.DataAnnotations;

namespace sanavita.Dto
{
    public class AppointmentDto
    {
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Notes { get; set; }
    }
}
