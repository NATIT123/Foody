import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import customResourceResponse from "../utils/constant.js";
import catchAsync from "../utils/catchAsync.js";
class AlbumRepository {
  constructor(albumModel) {
    this.albumModel = albumModel;
  }

  addAlbum() {
    return createOne(this.albumModel);
  }

  getAllAlbums() {
    return getAll(this.albumModel);
  }

  getAlbumById() {
    return getOne(this.albumModel, "restaurantId");
  }

  updateAlbumById() {
    return updateOne(this.albumModel);
  }

  deleteAlbumById() {
    return deleteOne(this.albumModel);
  }

  getAlbumsByRestaurant() {
    return catchAsync(async (req, res, next) => {
      const restaurantId = req.params.restaurantId;
      if (!restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
        return next(
          new AppError(
            customResourceResponse.notValidId.message,
            customResourceResponse.notValidId.statusCode
          )
        );
      }
      const doc = await this.albumModel.find({ restaurantId });
      // SEND RESPONSE
      if (!doc) {
        return next(
          new AppError(
            customResourceResponse.recordNotFound.message,
            customResourceResponse.recordNotFound.statusCode
          )
        );
      }
      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
        results: doc.length,
        data: {
          data: doc,
        },
      });
    });
  }
}
export default AlbumRepository;
