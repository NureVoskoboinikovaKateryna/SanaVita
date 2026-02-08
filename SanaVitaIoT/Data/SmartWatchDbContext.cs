using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using SanaVitaIoT.Models;
using SanaVitaIoT.Controllers;

namespace SanaVitaIoT.Data
{
    public class SmartWatchDbContext : DbContext
    {
        public SmartWatchDbContext(DbContextOptions<SmartWatchDbContext> options) : base(options) { }

        public DbSet<Measurement> Measurements { get; set; }
    }

}
