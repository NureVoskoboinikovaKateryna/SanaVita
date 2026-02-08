using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;

namespace sanavita.Repository
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly DataContext _context;

        public CompanyRepository(DataContext context)
        {
            _context = context;
        }

        public bool CompanyExists(int companyId)
        {
            return _context.Companies.Any(e => e.CompanyId == companyId);
        }

        public bool CreateCompany(Company company)
        {
            _context.Add(company);
            return Save();
        }

        public bool DeleteCompany(Company company)
        {
            _context.Remove(company);
            return Save();
        }

        public ICollection<Company> GetCompanies()
        {
            return _context.Companies.OrderBy(e => e.CompanyId).ToList();
        }

        public Company GetCompany(int companyId)
        {
            return _context.Companies.Where(e => e.CompanyId == companyId).FirstOrDefault();
        }

        public ICollection<CompanyManager> GetCompanyManagersByCompany(int companyId)
        {
            return _context.CompanyManagers.Where(e => e.CompanyId == companyId).ToList();
        }

        public ICollection<Patient> GetPatientsByCompany(int companyId)
        {
            return _context.Patients.Where(e => e.CompanyId == companyId).ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateCompany(Company company)
        {
            _context.Update(company);
            return Save();
        }
    }
}
