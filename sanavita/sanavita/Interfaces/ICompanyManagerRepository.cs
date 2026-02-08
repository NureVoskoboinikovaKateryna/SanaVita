using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface ICompanyManagerRepository
    {
        ICollection<CompanyManager> GetCompanyManagers();
        CompanyManager GetCompanyManager(int managerId);
        CompanyManager GetCompanyManagerByEmail(string email);
        bool CompanyManagerExists(int managerId);
        bool CompanyManagerExistsByEmail(string email);
        bool CreateCompanyManager(CompanyManager companyManager);
        bool UpdateCompanyManager(CompanyManager companyManager);
        bool DeleteCompanyManager(CompanyManager companyManager);
        bool Save();
    }
}
