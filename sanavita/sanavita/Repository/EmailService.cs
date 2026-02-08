using System.Net;
using System.Net.Mail;
using sanavita.Interfaces;

namespace sanavita.Repository
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendAppointmentEmail(string toEmail, string patientName, DateTime dateTime, string doctorFullName, string notes)
        {
            string senderEmail = _configuration["EmailSettings:Sender"];
            string password = _configuration["EmailSettings:Password"];

            var message = new MailMessage();
            message.To.Add(toEmail);
            message.Subject = "Запис до лікаря";

            string body = $"Шановний(а) {patientName},\n\n" +
                  $"Вас записано на прийом до лікаря: {doctorFullName}.\n" +
                  $"Дата та час прийому: {dateTime:dd.MM.yyyy HH:mm}.\n\n";
            
            if (!string.IsNullOrWhiteSpace(notes))
            {
                body += $"Нотатки від лікаря:\n{notes}\n\n";
            }
            body += "З повагою,\nСервіс SanaVita";

            message.Body = body;
            message.From = new MailAddress(senderEmail);

            using var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(senderEmail, password),
                EnableSsl = true
            };

            await smtp.SendMailAsync(message);
        }
    }
}
