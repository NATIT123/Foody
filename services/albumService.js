import customResourceResponse from "../utils/constant.js";

class AlbumService {
  constructor(albumRepo) {
    this.albumRepo = albumRepo;
  }

  async addAlbum(req) {
    const { image, type, timeVideo } = req.body;

    const response = {};
    if (!name || !image) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const album = await this.albumRepo.addAlbum(image, type, timeVideo);

    if (!album) {
      response.message = customResourceResponse.serverError.message;
      response.statusCode = customResourceResponse.serverError.statusCode;
      return response;
    }

    response.message = customResourceResponse.created.message;
    response.statusCode = customResourceResponse.created.statusCode;
    response.data = album._id;

    return response;
  }

  async getAllAlbums() {
    const response = {};
    response.data = [];
    const restaurants = await this.albumRepo.getAllAlbums();
    if (!restaurants) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = restaurants;
    return response;
  }

  async getAlbumById(req) {
    const response = {};
    response.data = {};
    const { id } = req.params;
    const album = await this.albumRepo.getAlbumById(id);
    if (!album) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = album;
    return response;
  }

  async updateAlbumById(req) {
    const { image, type, timeVideo } = req.body;
    const { id } = req.params;
    const response = {};
    if (!type || !image) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const album = await this.albumRepo.getAlbumById(id);
    if (!album) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    const updatedAlbum = await this.albumRepo.updateAlbumById(id, album);
    if (!updatedAlbum) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      response.data = updatedAlbum._id;
      return response;
    }
  }

  async deleteAlbumById(req) {
    const { id } = req.params;
    const response = {};

    const user = await this.userRepo.getAlbumById(id);
    if (!user) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    const deleteAlbum = await this.userRepo.deleteAlbumById(id);
    if (!deleteAlbum) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      response.data = deleteAlbum._id;
      return response;
    }
  }
}

export default AlbumService;
