import customResourceResponse from "../utils/constant.js";

class CommentService {
  constructor(commentRepo) {
    this.commentRepo = commentRepo;
  }

  countComments() {
    return this.commentRepo.countComments();
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

  handleLike() {
    return this.commentRepo.handleLike();
  }

  replyComment() {
    return this.commentRepo.replyComment();
  }
}

export default CommentService;
