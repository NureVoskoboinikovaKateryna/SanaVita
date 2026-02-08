using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using sanavita.POST;
using sanavita.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;

namespace sanavita.Controllers
{
    [Route("api/Administrators")]
    [ApiController]
    public class AdministratorController : Controller
    {
        private readonly IAdministratorRepository _administratorRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public AdministratorController(
            IAdministratorRepository administratorRepository, 
            UserManager<ApplicationUser> userManager,
            IMapper mapper)
        {
            _administratorRepository = administratorRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Administrator>))]
        public IActionResult GetAdministrators()
        {
            var administrators = _administratorRepository.GetAdministrators();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            return Ok(administrators);
        }

        [HttpGet("{adminId}")]
        [ProducesResponseType(200, Type = typeof(Administrator))]
        [ProducesResponseType(400)]
        public IActionResult GetAdministrator(int adminId)
        {
            if (!_administratorRepository.AdministratorExists(adminId))
                return NotFound();

            var administrator = _administratorRepository.GetAdministrator(adminId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(administrator);
        }

        [HttpGet("email/{email}")]
        [ProducesResponseType(200, Type = typeof(Administrator))]
        [ProducesResponseType(400)]
        public IActionResult GetAdministratorByEmail(string email)
        {
            if (!_administratorRepository.AdministratorExistsByEmail(email))
                return NotFound();

            var administrator = _administratorRepository.GetAdministratorByEmail(email);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(administrator);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateAdministrator([FromBody] AdministratorDto administratorCreate)
        {
            if (administratorCreate == null)
                return BadRequest(ModelState);
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var administratorMap = _mapper.Map<Administrator>(administratorCreate);
            if (!_administratorRepository.CreateAdministrator(administratorMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{adminId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateAdministrator(int adminId, [FromBody] AdministratorUPDATE administratorUpdate)
        {
            if (administratorUpdate == null)
                return BadRequest(ModelState);

            if (!_administratorRepository.AdministratorExists(adminId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            Administrator admin = _administratorRepository.GetAdministrator(adminId);
            ApplicationUser account = admin.ApplicationUser;
            account.LastName = administratorUpdate.LastName;
            account.Name = administratorUpdate.Name;
            account.MiddleName = administratorUpdate.MiddleName;
            account.Email = administratorUpdate.Email;
            account.PhoneNumber = administratorUpdate.PhoneNumber;
            _userManager.UpdateAsync(account).Wait();

            admin.ApplicationUser = account;

            if (!_administratorRepository.UpdateAdministrator(admin))
            {
                ModelState.AddModelError("", "Something went wrong updating administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{adminId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteAdministrator(int adminId)
        {
            if (!_administratorRepository.AdministratorExists(adminId))
                return NotFound();

            var administratorToDelete = _administratorRepository.GetAdministrator(adminId);
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_administratorRepository.DeleteAdministrator(administratorToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting administrator");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("acc/{adminId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteAdministratorAndAccount(int adminId)
        {
            if (!_administratorRepository.AdministratorExists(adminId))
                return NotFound();

            Administrator adminToDelete = _administratorRepository.GetAdministrator(adminId);
            ApplicationUser account = adminToDelete.ApplicationUser;
            adminToDelete.ApplicationUser = null;
            _userManager.DeleteAsync(account).Wait();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_administratorRepository.DeleteAdministrator(adminToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patient");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
