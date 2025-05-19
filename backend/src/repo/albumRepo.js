import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../controllers/handleFactory.js";
import customResourceResponse from "../utils/constant.js";
import { v2 as cloudinary } from "cloudinary";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
class AlbumRepository {
  constructor(albumModel) {
    this.albumModel = albumModel;
  }

  countAlbums() {
    return catchAsync(async (req, res, next) => {
      try {
        const totalAlbums = await this.albumModel.countDocuments();
        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: totalAlbums,
        });
      } catch (err) {
        return next(new AppError("Server error", 500));
      }
    });
  }

  addAlbum() {
    return catchAsync(async (req, res, next) => {
      try {
        const { restaurantId, userId } = req.body;
        if (
          !restaurantId.match(/^[0-9a-fA-F]{24}$/) ||
          !userId.match(/^[0-9a-fA-F]{24}$/)
        ) {
          return next(
            new AppError(
              customResourceResponse.notValidId.message,
              customResourceResponse.notValidId.statusCode
            )
          );
        }
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const uploadStream = () => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "albums" },
              (error, result) => {
                if (error) return reject(new AppError("Upload failed!", 500));
                resolve(result.secure_url);
              }
            );
            stream.end(req.file.buffer);
          });
        };

        const imageUrl = await uploadStream();
        await this.albumModel.create({
          image: imageUrl,
          userId,
          restaurantId,
        });

        res.status(customResourceResponse.success.statusCode).json({
          message: "Upload thành công!",
          status: "success",
          data: { photo: imageUrl },
        });
      } catch (err) {
        console.log(err);
        return next(new AppError("Something went wrong!", 500));
      }
    });
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
      const doc = await this.albumModel
        .find({ restaurantId })
        .select("image createdAt");
      // SEND RESPONSE
      const filteredDoc = doc.filter(
        (album) => !album.image.startsWith("data:image")
      );

      if (!filteredDoc.length) {
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
        results: filteredDoc.length,
        data: { data: filteredDoc },
      });
    });
  }
}
export default AlbumRepository;
