import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
class CommentRepository {
  constructor(commentModel) {
    this.commentModel = commentModel;
  }

  addComment() {
    return createOne(this.commentModel);
  }

  getAllComments() {
    return getAll(this.commentModel);
  }

  getCommentById() {
    return getOne(this.commentModel);
  }

  updateCommentById() {
    return updateOne(this.commentModel);
  }

  deleteCommentById() {
    return deleteOne(this.commentModel);
  }
}
export default CommentRepository;
