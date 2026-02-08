namespace sanavita.Dto
{
    public class PatientUserDto : ApplicationUserDto
    {
        public int BTypeId {  get; set; }
        public int CompanyId { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public int Age { get; set; }
        public int Height { get; set; }
    }
}
