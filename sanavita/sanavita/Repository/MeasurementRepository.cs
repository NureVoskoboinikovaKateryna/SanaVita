using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;
using Microsoft.EntityFrameworkCore;

namespace sanavita.Repository
{
    public class MeasurementRepository : IMeasurementRepository
    {
        private readonly DataContext _context;

        public MeasurementRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateMeasurement(Measurement measurement)
        {
            _context.Add(measurement);
            return Save();
        }

        public bool DeleteMeasurement(Measurement measurement)
        {
            _context.Remove(measurement);
            return Save();
        }

        public Measurement GetMeasurement(int measurId)
        {
            return _context.Measurements.Where(e => e.MeasurementId == measurId).FirstOrDefault();
        }

        public ICollection<Measurement> GetMeasurements()
        {
            return _context.Measurements
                .Include(e => e.MedicalDevice)
                .ThenInclude(e => e.MedicalDeviceType)
                .OrderBy(e => e.MeasurementId)
                .ToList();
        }

        public ICollection<Measurement> GetMeasurementsByPatient(int patientId)
        {
            return _context.Measurements
                .Include(e => e.MedicalDevice)
                .ThenInclude(e => e.MedicalDeviceType)
                .Where(e => e.PatientId ==  patientId)
                .ToList();
        }

        public ICollection<Measurement> GetMeasurementsByPatientAndType(int patientId, int mdevicetypeId)
        {
            return _context.Measurements.Where(e => e.PatientId == patientId && 
                e.MedicalDevice.MedicalDeviceTypeId == mdevicetypeId).ToList();
        }

        public bool MeasurementExists(int measurId)
        {
            return _context.Measurements.Any(e => e.MeasurementId == measurId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateMeasurement(Measurement measurement)
        {
            _context.Update(measurement);
            return Save();
        }
    }
}
