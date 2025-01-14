import customResourceResponse from "../utils/constant.js";

class CommentService {
  constructor(commentRepo) {
    this.commentRepo = commentRepo;
  }

  addComment() {
    return this.commentRepo.addComment();
  }

  getAllComments() {
    return this.commentRepo.getAllComments();
  }

  getCommentById() {
    return this.commentRepo.getCommentById();
  }

  updateCommentById() {
    return this.commentRepo.updateCommentById();
  }

  deleteCommentById() {
    return this.commentRepo.deleteCommentById();
  }

  getCommentsByRestaurant() {
    return this.commentRepo.getCommentsByRestaurant();
  }
}

export default CommentService;
