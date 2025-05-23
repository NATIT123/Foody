import NotificationRepo from "../repo/notificationRepo.js";
import NotificationService from "../services/notificationService.js";
import NotificationModel from "../models/notificationModel.js";
var notificationRepo = new NotificationRepo(NotificationModel);
var notificationService = new NotificationService(notificationRepo);
export var addNotification = notificationService.addNotification();
export var getAllNotifications = notificationService.getAllNotifications();
export var getNotificationById = notificationService.getNotificationById();
export var updateNotificationById = notificationService.updateNotificationById();
export var deleteNotificationById = notificationService.deleteNotificationById();
export var makeAllIsRead = notificationService.makeAllIsRead();
export var getNoitificationsByUserId = notificationService.getNotificationsByUserId();