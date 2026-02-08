using sanavita.Models;

namespace sanavita.Dto
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int SenderId { get; set; }
        public UserType SenderType { get; set; }
        public int ReceiverId { get; set; }
        public UserType ReceiverType { get; set; }
        public DateTime Date { get; set; }
    }
}