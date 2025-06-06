import { Router } from "express";
const router = Router();
import { protect } from "../controllers/authController.js";
import {
  addNotification,
  getAllNotifications,
  deleteNotificationById,
  updateNotificationById,
  getNotificationById,
  makeAllIsRead,
  getNoitificationsByUserId,
} from "../controllers/notificationController.js";
router.use(protect);
router.get("/getAllNotifications", getAllNotifications);
router.post("/addNotification", addNotification);
router.delete("/deleteNotification/:id", deleteNotificationById);
router.patch("/updateNotification/:id", updateNotificationById);
router.get("/getNotification/:id", getNotificationById);
router.get("/makeAll/:userId", makeAllIsRead);
router.get("/getNotificationsByUserId/:userId", getNoitificationsByUserId);
export default router;
