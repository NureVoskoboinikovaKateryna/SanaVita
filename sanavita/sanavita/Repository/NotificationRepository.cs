using sanavita.Data;
using sanavita.Interfaces;
using sanavita.Models;

namespace sanavita.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly DataContext _context;

        public NotificationRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateNotification(Notification notification)
        {
            _context.Add(notification);
            return Save();
        }

        public bool DeleteNotification(Notification notification)
        {
            _context.Remove(notification);
            return Save();
        }

        public Notification GetNotification(int notifId)
        {
            return _context.Notifications.Where(e => e.NotificationId == notifId).FirstOrDefault();
        }

        public ICollection<Notification> GetNotifications()
        {
            return _context.Notifications.OrderBy(e => e.NotificationId).ToList();
        }

        public ICollection<Notification> GetNotificationsByDoctor(int doctorId)
        {
            return _context.Notifications.Where(n =>
                (n.SenderType == UserType.Doctor && n.SenderId == doctorId) ||
                (n.ReceiverType == UserType.Doctor && n.ReceiverId == doctorId)).ToList();
        }

        public ICollection<Notification> GetNotificationsByPatient(int patientId)
        {
            return _context.Notifications.Where(n =>
                (n.SenderType == UserType.Patient && n.SenderId == patientId) ||
                (n.ReceiverType == UserType.Patient && n.ReceiverId == patientId)).ToList();
        }

        public bool NotificationExists(int notifId)
        {
            return _context.Notifications.Any(e => e.NotificationId == notifId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateNotification(Notification notification)
        {
            _context.Update(notification);
            return Save();
        }
    }
}