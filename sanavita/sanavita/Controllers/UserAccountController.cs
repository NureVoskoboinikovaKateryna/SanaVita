using sanavita.Dto;
using sanavita.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/Accounts")]
    [ApiController]
    public class UserAccountController : ControllerBase
    {
        private readonly IApplicationUserRepository _userAccountRepository;

        public UserAccountController(IApplicationUserRepository userAccountRepository)
        {
            _userAccountRepository = userAccountRepository;
        }

        // [Authorize(Roles = "Administrator")]
        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdministrator(ApplicationUserDto userDto)
        {
            var response = await _userAccountRepository.CreateAdministratorAccount(userDto);
            return Ok(response);
        }

        [HttpPost("register-manager")]
        public async Task<IActionResult> RegisterCompanyManager(
            [FromBody] CompanyManagerUserDto userDto)
        {
            var response = await _userAccountRepository.CreateCompanyManagerAccount(userDto);
            return Ok(response);
        }

        [HttpPost("register-doctor")]
        public async Task<IActionResult> RegisterDoctor(DoctorUserDto doctorUserDto)
        {
            var response = await _userAccountRepository.CreateDoctorAccount(doctorUserDto);
            return Ok(response);
        }

        [HttpPost("register-patient")]
        public async Task<IActionResult> RegisterPatient(
            PatientUserDto userDto)
        {
            var response = await _userAccountRepository.CreatePatientAccount(userDto);
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var response = await _userAccountRepository.LoginAccount(loginDto);
            return Ok(response);
        }
    }
}
