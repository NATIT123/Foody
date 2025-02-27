import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var NotificationService = /*#__PURE__*/function () {
  function NotificationService(notificationRepo) {
    _classCallCheck(this, NotificationService);
    this.notificationRepo = notificationRepo;
  }
  return _createClass(NotificationService, [{
    key: "addNotification",
    value: function addNotification() {
      return this.notificationRepo.addNotification();
    }
  }, {
    key: "getAllNotifications",
    value: function getAllNotifications() {
      return this.notificationRepo.getAll();
    }
  }, {
    key: "getNotificationById",
    value: function getNotificationById() {
      return this.notificationRepo.getNotificationById();
    }
  }, {
    key: "updateNotificationById",
    value: function updateNotificationById() {
      return this.notificationRepo.updateNotificationById();
    }
  }, {
    key: "deleteNotificationById",
    value: function deleteNotificationById() {
      return this.notificationRepo.deleteNotificationById();
    }
  }, {
    key: "makeAllIsRead",
    value: function makeAllIsRead() {
      return this.notificationRepo.makeAllIsRead();
    }
  }, {
    key: "getNotificationsByUserId",
    value: function getNotificationsByUserId() {
      return this.notificationRepo.getNotificationsByUserId();
    }
  }]);
}();
export default NotificationService;