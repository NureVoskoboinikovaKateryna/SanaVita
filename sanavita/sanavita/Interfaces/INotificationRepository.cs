using sanavita.Models;

namespace sanavita.Interfaces
{
    public interface INotificationRepository
    {
        ICollection<Notification> GetNotifications();
        Notification GetNotification(int notifId);
        ICollection<Notification> GetNotificationsByPatient(int patientId);
        ICollection<Notification> GetNotificationsByDoctor(int doctorId);
        bool NotificationExists(int notifId);
        bool CreateNotification(Notification notification);
        bool UpdateNotification(Notification notification);
        bool DeleteNotification(Notification notification);
        bool Save();
    }
}
