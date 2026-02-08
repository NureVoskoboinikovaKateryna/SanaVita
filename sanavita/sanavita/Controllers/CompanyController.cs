using AutoMapper;
using sanavita.Dto;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace sanavita.Controllers
{
    [Route("api/Companies")]
    [ApiController]
    public class CompanyController : Controller
    {
        private readonly ICompanyManagerRepository _companyManagerRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;

        public CompanyController(
            ICompanyManagerRepository companyManagerRepository,
            IPatientRepository patientRepository,
            ICompanyRepository companyRepository,
            IMapper mapper)
        {
            _companyManagerRepository = companyManagerRepository;
            _patientRepository = patientRepository;
            _companyRepository = companyRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Company>))]
        public IActionResult GetCompanies()
        {
            var companies = _mapper.Map<List<CompanyDto>>(_companyRepository.GetCompanies());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(companies);
        }

        [HttpGet("{companyId}")]
        [ProducesResponseType(200, Type = typeof(Company))]
        [ProducesResponseType(400)]
        public IActionResult GetCompany(int companyId)
        {
            if (!_companyRepository.CompanyExists(companyId))
                return NotFound();

            var company = _mapper.Map<CompanyDto>(_companyRepository.GetCompany(companyId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(company);
        }

        [HttpGet("patients/{companyId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Patient>))]
        [ProducesResponseType(400)]
        public IActionResult GetPatientsByCompany(int companyId)
        {
            if (!_companyRepository.CompanyExists(companyId))
                return NotFound();

            var patients = _mapper.Map<List<PatientDto>>(_companyRepository.GetPatientsByCompany(companyId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(patients);
        }

        [HttpGet("managers/{companyId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CompanyManager>))]
        [ProducesResponseType(400)]
        public IActionResult GetCompanyManagersByCompany(int companyId)
        {
            if (!_companyRepository.CompanyExists(companyId))
                return NotFound();

            var companyManagers = _mapper.Map<List<CompanyManagerDto>>(_companyRepository.GetCompanyManagersByCompany(companyId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(companyManagers);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateCompany([FromBody] CompanyDto companyCreate)
        {
            if (companyCreate == null)
                return BadRequest(ModelState);

            var company = _companyRepository.GetCompanies()
                .Where(e => e.CompanyName == companyCreate.CompanyName).FirstOrDefault();

            if (company != null)
            {
                ModelState.AddModelError("", "Company with this name already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var companyMap = _mapper.Map<Company>(companyCreate);
            if (!_companyRepository.CreateCompany(companyMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpPut("{companyId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateCompany(int companyId, [FromBody] CompanyDto companyUpdate)
        {
            if (companyUpdate == null || companyUpdate.CompanyId != companyId)
                return BadRequest(ModelState);

            if (!_companyRepository.CompanyExists(companyId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var companyMap = _mapper.Map<Company>(companyUpdate);
            if (!_companyRepository.UpdateCompany(companyMap))
            {
                ModelState.AddModelError("", "Something went wrong updating company");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }

        [HttpDelete("{companyId}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult DeleteCompany(int companyId)
        {
            if (!_companyRepository.CompanyExists(companyId))
                return NotFound();

            var companyToDelete = _companyRepository.GetCompany(companyId);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_companyRepository.DeleteCompany(companyToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting company");
                return StatusCode(500, ModelState);
            }

            return Ok(new { ok = true });
        }
    }
}
