using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface ICompanyRepository
    {
        ICollection<Company> GetCompanies();
        Company GetCompany(int companyId);
        ICollection<Patient> GetPatientsByCompany(int companyId);
        ICollection<CompanyManager> GetCompanyManagersByCompany(int companyId);
        bool CompanyExists(int companyId);
        bool CreateCompany(Company company);
        bool UpdateCompany(Company company);
        bool DeleteCompany(Company company);
        bool Save();
    }
}
