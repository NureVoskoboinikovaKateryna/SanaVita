namespace sanavita.Models
{
    public class CompanyManager
    {
        public int CompanyManagerId { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
