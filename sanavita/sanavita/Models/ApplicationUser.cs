using Microsoft.AspNetCore.Identity;

namespace sanavita.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
    }
}
