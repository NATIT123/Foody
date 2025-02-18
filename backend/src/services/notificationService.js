class NotificationService {
  constructor(notificationRepo) {
    this.notificationRepo = notificationRepo;
  }
  addNotification() {
    return this.notificationRepo.addNotification();
  }

  getAllNotifications() {
    return this.notificationRepo.getAll();
  }

  getNotificationById() {
    return this.notificationRepo.getNotificationById();
  }

  updateNotificationById() {
    return this.notificationRepo.updateNotificationById();
  }

  deleteNotificationById() {
    return this.notificationRepo.deleteNotificationById();
  }

  makeAllIsRead() {
    return this.notificationRepo.makeAllIsRead();
  }
  getNotificationsByUserId() {
    return this.notificationRepo.getNotificationsByUserId();
  }
}

export default NotificationService;
