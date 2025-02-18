import NotificationRepo from "../repo/notificationRepo.js";
import NotificationService from "../services/notificationService.js";

import NotificationModel from "../models/notificationModel.js";

const notificationRepo = new NotificationRepo(NotificationModel);
const notificationService = new NotificationService(notificationRepo);

export const addNotification = notificationService.addNotification();

export const getAllNotifications = notificationService.getAllNotifications();

export const getNotificationById = notificationService.getNotificationById();

export const updateNotificationById =
  notificationService.updateNotificationById();

export const deleteNotificationById =
  notificationService.deleteNotificationById();

export const makeAllIsRead = notificationService.makeAllIsRead();
export const getNoitificationsByUserId =
  notificationService.getNotificationsByUserId();
