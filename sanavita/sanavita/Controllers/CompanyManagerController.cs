using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using sanavita.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/CompanyManagers")]
    [ApiController]
    public class CompanyManagerController : Controller
    {
        private readonly ICompanyManagerRepository _сompanyManagerRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICompanyRepository _сompanyRepository;
        private readonly IMapper _mapper;

        public CompanyManagerController(
            ICompanyManagerRepository сompanyManagerRepository,
            UserManager<ApplicationUser> userManager,
            ICompanyRepository сompanyRepository,
            IMapper mapper)
        {
            _сompanyManagerRepository = сompanyManagerRepository;
            _сompanyRepository = сompanyRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CompanyManager>))]
        public IActionResult GetCompanyManagers()
        {
            var сompanyManagers = _сompanyManagerRepository.GetCompanyManagers();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(сompanyManagers);
        }

        [HttpGet("{managerId}")]
        [ProducesResponseType(200, Type = typeof(CompanyManager))]
        [ProducesResponseType(400)]
        public IActionResult GetCompanyManager(int managerId)
        {
            if (!_сompanyManagerRepository.CompanyManagerExists(managerId))
                return NotFound();

            var сompanyManager = _сompanyManagerRepository.GetCompanyManager(managerId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(сompanyManager);
        }

        [HttpGet("email/{email}")]
        [ProducesResponseType(200, Type = typeof(CompanyManager))]
        [ProducesResponseType(400)]
        public IActionResult GetCompanyManagerByEmail(string email)
        {
            if (!_сompanyManagerRepository.CompanyManagerExistsByEmail(email))
                return NotFound();

            var сompanyManager = _сompanyManagerRepository.GetCompanyManagerByEmail(email);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(сompanyManager);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateCompanyManager(
            [FromQuery] int companyId, 
            [FromBody] CompanyManagerDto companyManagerCreate)
        {
            if (companyManagerCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var companyManagerMap = _mapper.Map<CompanyManager>(companyManagerCreate);
            companyManagerMap.Company = _сompanyRepository.GetCompany(companyId);

            if (!_сompanyManagerRepository.CreateCompanyManager(companyManagerMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{managerId}")]
        [Authorize(Roles = "Administrator,CompanyManager")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateCompanyManager(
            int managerId, 
            [FromBody] CompanyManagerUPDATE companyManagerUpdate)
        {
            if (companyManagerUpdate == null)
                return BadRequest(ModelState);

            if (!_сompanyManagerRepository.CompanyManagerExists(managerId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            CompanyManager manager = _сompanyManagerRepository.GetCompanyManager(managerId);
            ApplicationUser account = manager.ApplicationUser;
            account.LastName = companyManagerUpdate.LastName;
            account.Name = companyManagerUpdate.Name;
            account.MiddleName = companyManagerUpdate.MiddleName;
            account.Email = companyManagerUpdate.Email;
            account.PhoneNumber = companyManagerUpdate.PhoneNumber;
            _userManager.UpdateAsync(account).Wait();

            manager.CompanyId = companyManagerUpdate.CompanyId;
            manager.Company = _сompanyRepository.GetCompany(companyManagerUpdate.CompanyId);
            manager.ApplicationUser = account;

            if (!_сompanyManagerRepository.UpdateCompanyManager(manager))
            {
                ModelState.AddModelError("", "Something went wrong updating company manager");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{managerId}")]
        [Authorize(Roles = "Administrator,CompanyManager")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteCompanyManager(int managerId)
        {
            if (!_сompanyManagerRepository.CompanyManagerExists(managerId))
                return NotFound();

            var companyManagerToDelete = _сompanyManagerRepository.GetCompanyManager(managerId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_сompanyManagerRepository.DeleteCompanyManager(companyManagerToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting company manager");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("acc/{managerId}")]
        [Authorize(Roles = "Administrator,CompanyManager")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeletePatientAndAccount(int managerId)
        {
            if (!_сompanyManagerRepository.CompanyManagerExists(managerId))
                return NotFound();

            CompanyManager managerToDelete = _сompanyManagerRepository.GetCompanyManager(managerId);
            ApplicationUser account = managerToDelete.ApplicationUser;
            managerToDelete.ApplicationUser = null;
            _userManager.DeleteAsync(account).Wait();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_сompanyManagerRepository.DeleteCompanyManager(managerToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting patient");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
