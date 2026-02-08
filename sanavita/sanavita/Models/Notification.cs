namespace sanavita.Models
{
    public enum UserType
    {
        Doctor,
        Patient
    }

    public class Notification
    {
        public int NotificationId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int SenderId { get; set; }
        public UserType SenderType { get; set; }
        public int ReceiverId { get; set; }
        public UserType ReceiverType { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}