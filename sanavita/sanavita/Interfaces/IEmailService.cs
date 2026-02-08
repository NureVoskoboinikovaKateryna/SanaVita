using System;
using System.Threading.Tasks;

namespace sanavita.Interfaces
{
    public interface IEmailService
    {
        Task SendAppointmentEmail(string toEmail, string patientName, DateTime dateTime, string doctorFullName, string notes);
    }
}
