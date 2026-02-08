namespace sanavita.Models
{
    public class Company
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public ICollection<Patient> Patients { get; set; }
        public ICollection<CompanyManager> CompanyManagers { get; set; }
    }
}
