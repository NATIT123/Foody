class CommentRepository {
  constructor(commentModel) {
    this.commentModel = commentModel;
  }

  async addComment(user) {
    return await this.commentModel.create(user);
  }

  async getAllComments() {
    return await this.commentModel.findAll();
  }

  async getCommentById(id) {
    return await this.commentModel.findOne({ id });
  }

  async updateCommentById(id, user) {
    return await this.commentModel.update(id, user);
  }

  async deleteCommentById(id) {
    return await this.commentModel.delete(id);
  }
}
export default CommentRepository;
