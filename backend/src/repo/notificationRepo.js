import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
class NotificationRepository {
  constructor(notificationModel) {
    this.notificationModel = notificationModel;
  }

  addNotification() {
    return createOne(this.notificationModel);
  }

  getAll() {
    return getAll(this.notificationModel);
  }

  getNotificationById() {
    return getOne(this.notificationModel);
  }

  updateNotificationById() {
    return updateOne(this.notificationModel);
  }

  deleteNotificationById() {
    return deleteOne(this.notificationModel);
  }
  makeAllIsRead() {
    return catchAsync(async (req, res, next) => {
      try {
        const { userId } = req.params;
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
          return next(
            new AppError(
              customResourceResponse.notValidId.message,
              customResourceResponse.notValidId.statusCode
            )
          );
        }
        await this.notificationModel.updateMany(
          { userId, isRead: false },
          { $set: { isRead: true } }
        );
        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
        });
      } catch (err) {
        console.log(err);
        return next(new AppError("Server error", 500));
      }
    });
  }
}
export default NotificationRepository;
