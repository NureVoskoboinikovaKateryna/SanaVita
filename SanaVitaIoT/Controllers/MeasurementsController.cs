using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SanaVitaIoT.Data;
using SanaVitaIoT.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartWatchApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MeasurementsController : ControllerBase
    {
        private readonly SmartWatchDbContext _context;

        public MeasurementsController(SmartWatchDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Measurement>>> GetMeasurements()
        {
            return await _context.Measurements.ToListAsync();
        }
    }
}
