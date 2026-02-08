using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface IAdministratorRepository
    {
        ICollection<Administrator> GetAdministrators();
        Administrator GetAdministrator(int id);
        Administrator GetAdministratorByEmail(string email);
        bool AdministratorExists(int id);
        bool AdministratorExistsByEmail(string email);
        bool CreateAdministrator(Administrator administrator);
        bool UpdateAdministrator(Administrator administrator);
        bool DeleteAdministrator(Administrator administrator);
        bool Save();
    }
}
