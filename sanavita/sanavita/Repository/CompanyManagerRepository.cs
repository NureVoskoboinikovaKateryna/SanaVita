using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.EntityFrameworkCore;

namespace sanavita.Repository
{
    public class CompanyManagerRepository : ICompanyManagerRepository
    {
        private readonly DataContext _context;

        public CompanyManagerRepository(DataContext context)
        {
            _context = context;
        }

        public bool CompanyManagerExists(int managerId)
        {
            return _context.CompanyManagers.Any(e => e.CompanyManagerId == managerId);
        }

        public bool CompanyManagerExistsByEmail(string email)
        {
            return _context.CompanyManagers.Any(e => e.ApplicationUser.Email == email);
        }

        public bool CreateCompanyManager(CompanyManager companyManager)
        {
            _context.Add(companyManager);
            return Save();
        }

        public bool DeleteCompanyManager(CompanyManager companyManager)
        {
            _context.Remove(companyManager);
            return Save();
        }

        public CompanyManager GetCompanyManager(int managerId)
        {
            return _context.CompanyManagers
                .Include(e => e.ApplicationUser)
                .Include(e => e.Company)
                .Where(e => e.CompanyManagerId == managerId)
                .FirstOrDefault();
        }

        public CompanyManager GetCompanyManagerByEmail(string email)
        {
            return _context.CompanyManagers
                .Include(e => e.ApplicationUser)
                .Where(e => e.ApplicationUser.Email == email)
                .FirstOrDefault();
        }

        public ICollection<CompanyManager> GetCompanyManagers()
        {
            return _context.CompanyManagers
                .Include(e => e.Company)
                .Include(e => e.ApplicationUser)
                .OrderBy(e => e.CompanyManagerId)
                .ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateCompanyManager(CompanyManager companyManager)
        {
            _context.Update(companyManager);
            return Save();
        }
    }
}
