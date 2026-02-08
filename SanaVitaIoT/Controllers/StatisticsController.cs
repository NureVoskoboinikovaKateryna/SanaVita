using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SanaVitaIoT.Data;
using System.Linq;
using System.Threading.Tasks;

namespace SanaVitaIoT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly SmartWatchDbContext _context;

        public StatisticsController(SmartWatchDbContext context)
        {
            _context = context;
        }

        [HttpGet("average-temperature")]
        public async Task<IActionResult> GetAverageTemperature(int patientId, int medicalDeviceId)
        {
            var measurements = await _context.Measurements
                .Where(m => m.PatientId == patientId && m.MedicalDeviceId == medicalDeviceId)
                .ToListAsync();

            if (measurements == null || !measurements.Any())
            {
                return NotFound("No measurements found for the given patient and device.");
            }

            var averageTemperature = measurements.Average(m => m.MeasurementValue);

            return Ok(new { AverageTemperature = averageTemperature });
        }
    }
}
