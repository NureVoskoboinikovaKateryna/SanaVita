using sanavita.Models;

namespace sanavita.POST
{
    public class PatientUPDATE
    {
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public int Age { get; set; }
        public int Height { get; set; }
        public int BTypeId { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }
}
