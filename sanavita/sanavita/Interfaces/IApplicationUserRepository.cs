using static sanavita.Dto.ServiceResponseDto;
using sanavita.Dto;

namespace sanavita.Interfaces
{
    public interface IApplicationUserRepository
    {
        Task<GeneralResponse> CreateAdministratorAccount(ApplicationUserDto userDto);
        Task<GeneralResponse> CreateCompanyManagerAccount(CompanyManagerUserDto userDto);
        Task<GeneralResponse> CreateDoctorAccount(DoctorUserDto userDto);
        Task<GeneralResponse> CreatePatientAccount(PatientUserDto userDto);
        Task<LoginResponse> LoginAccount(LoginDto loginDto);
    }
}
