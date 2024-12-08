import customResourceResponse from "../utils/constant.js";

class CommentService {
  constructor(commentRepo) {
    this.commentRepo = commentRepo;
  }

  async addcommentRepo(req) {
    const { userImage, userName, time, rate, description, type } = req.body;

    const response = {};
    if (!name || !image) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const comment = await this.commentRepo.addcommentRepo(
      name,
      image,
      address,
      location,
      district,
      area,
      category,
      cusines,
      audiences,
      qualityRate,
      serviceRate,
      postionRate,
      priceRate,
      spaceRate,
      timeOpen,
      priceRange
    );

    if (!comment) {
      response.message = customResourceResponse.serverError.message;
      response.statusCode = customResourceResponse.serverError.statusCode;
      return response;
    }

    response.message = customResourceResponse.created.message;
    response.statusCode = customResourceResponse.created.statusCode;
    response.data = commentRepo._id;

    return response;
  }

  async getAllcommentRepos() {
    const response = {};
    response.data = [];
    const comments = await this.commentRepo.getAllcommentRepos();
    if (!comments) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = comments;
    return response;
  }

  async getcommentRepoById(req) {
    const response = {};
    response.data = {};
    const { id } = req.params;
    const comment = await this.commentRepo.getcommentRepoById(id);
    if (!comment) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = comment;
    return response;
  }

  async updatecommentRepoById(req) {
    const { userImage, userName, time, rate, description, type } = req.body;
    const { id } = req.params;
    const response = {};
    if (!userImage || !userName) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const comment = await this.commentRepo.getcommentRepoById(id);
    if (!comment) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    const updatedcomment = await this.commentRepo.updatecommentRepoById(
      id,
      comment
    );
    if (!updatedcomment) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      response.data = updatedcomment._id;
      return response;
    }
  }

  async deletecommentRepoById(req) {
    const { id } = req.params;
    const response = {};

    const user = await this.commentRepo.getcommentRepoById(id);
    if (!user) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    const deletecomment = await this.commentRepo.deletecommentRepoById(id);
    if (!deletecomment) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      response.data = deletecomment._id;
      return response;
    }
  }
}

export default CommentService;
