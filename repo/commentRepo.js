class CommentRepository {
  constructor(commentModel) {
    this.commentModel = commentModel;
  }

  addComment(user) {
    return this.commentModel.create(user);
  }

  getAllComments() {
    return this.commentModel.findAll();
  }

  getCommentById(id) {
    return this.commentModel.findOne({ id });
  }

  updateCommentById(id, user) {
    return this.commentModel.update(id, user);
  }

  deleteCommentById(id) {
    return this.commentModel.delete(id);
  }
}
export default CommentRepository;
