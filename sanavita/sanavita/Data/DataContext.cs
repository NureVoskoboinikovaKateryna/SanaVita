using sanavita.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace sanavita.Data
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        public DbSet<Administrator> Administrators { get; set; }
        public DbSet<BloodType> BloodTypes { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<CompanyManager> CompanyManagers { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Manufacturer> Manufacturers { get; set; }
        public DbSet<Measurement> Measurements { get; set; }
        public DbSet<MedicalDevice> MedicalDevices { get; set; }
        public DbSet<MedicalDeviceType> MedicalDeviceTypes { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Company>()
                .HasMany(e => e.CompanyManagers)
                .WithOne(e => e.Company)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Company>()
                .HasMany(e => e.Patients)
                .WithOne(e => e.Company)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Patient>()
                .HasMany(e => e.Measurements)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Patient>()
                .HasMany(e => e.MedicalRecords)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Doctor>()
                .HasMany(e => e.MedicalRecords)
                .WithOne(e => e.Doctor)
                .HasForeignKey(e => e.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MedicalDeviceType>()
                .HasMany(e => e.MedicalDevices)
                .WithOne(e => e.MedicalDeviceType)
                .HasForeignKey(e => e.MedicalDeviceTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Manufacturer>()
                .HasMany(e => e.MedicalDevices)
                .WithOne(e => e.Manufacturer)
                .HasForeignKey(e => e.ManufacturerId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
