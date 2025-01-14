import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import customResourceResponse from "../utils/constant.js";
var CommentService = /*#__PURE__*/function () {
  function CommentService(commentRepo) {
    _classCallCheck(this, CommentService);
    this.commentRepo = commentRepo;
  }
  return _createClass(CommentService, [{
    key: "addComment",
    value: function addComment() {
      return this.commentRepo.addComment();
    }
  }, {
    key: "getAllComments",
    value: function getAllComments() {
      return this.commentRepo.getAllComments();
    }
  }, {
    key: "getCommentById",
    value: function getCommentById() {
      return this.commentRepo.getCommentById();
    }
  }, {
    key: "updateCommentById",
    value: function updateCommentById() {
      return this.commentRepo.updateCommentById();
    }
  }, {
    key: "deleteCommentById",
    value: function deleteCommentById() {
      return this.commentRepo.deleteCommentById();
    }
  }, {
    key: "getCommentsByRestaurant",
    value: function getCommentsByRestaurant() {
      return this.commentRepo.getCommentsByRestaurant();
    }
  }]);
}();
export default CommentService;