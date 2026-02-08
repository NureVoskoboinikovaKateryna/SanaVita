using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.EntityFrameworkCore;

namespace sanavita.Repository
{
    public class AdministratorRepository : IAdministratorRepository
    {
        private readonly DataContext _context;

        public AdministratorRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Administrator> GetAdministrators()
        {
            return _context.Administrators
                .Include(e => e.ApplicationUser)
                .OrderBy(e => e.AdministratorId)
                .ToList();
        }

        public Administrator GetAdministrator(int adminId)
        {
            return _context.Administrators
                .Include(e => e.ApplicationUser)
                .Where(e => e.AdministratorId == adminId)
                .FirstOrDefault();
        }

        public bool AdministratorExists(int adminId)
        {
            return _context.Administrators.Any(e => e.AdministratorId == adminId);
        }

        public bool CreateAdministrator(Administrator administrator)
        {
            _context.Add(administrator);
            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateAdministrator(Administrator administrator)
        {
            _context.Update(administrator);
            return Save();
        }

        public bool DeleteAdministrator(Administrator administrator)
        {
            _context.Remove(administrator);
            return Save();
        }

        public Administrator GetAdministratorByEmail(string email)
        {
            return _context.Administrators
                .Include(e => e.ApplicationUser)
                .Where(e => e.ApplicationUser.Email == email)
                .FirstOrDefault();
        }

        public bool AdministratorExistsByEmail(string email)
        {
            return _context.Administrators.Any(e => e.ApplicationUser.Email == email);
        }
    }
}
