using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface IMeasurementRepository
    {
        ICollection<Measurement> GetMeasurements();
        Measurement GetMeasurement(int measurId);
        ICollection<Measurement> GetMeasurementsByPatient(int patientId);
        ICollection<Measurement> GetMeasurementsByPatientAndType(int patientId, int mdevicetypeId);
        bool MeasurementExists(int measurId);
        bool CreateMeasurement(Measurement measurement);
        bool UpdateMeasurement(Measurement measurement);
        bool DeleteMeasurement(Measurement measurement);
        bool Save();
    }
}
