import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import { v2 as cloudinary } from "cloudinary";
import AppError from "../utils/appError.js";
class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  addUser() {
    return createOne(this.userModel);
  }

  getAll() {
    return getAll(this.userModel);
  }

  getUserById() {
    return getOne(this.userModel);
  }

  updateUserById() {
    return updateOne(this.userModel);
  }

  deleteUserById() {
    return deleteOne(this.userModel);
  }
  uploadPhoto() {
    return catchAsync(async (req, res, next) => {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      try {
        const uploadStream = () => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "users" },
              (error, result) => {
                if (error) return reject(new AppError("Upload failed!", 500));
                resolve(result.secure_url);
              }
            );
            stream.end(req.file.buffer);
          });
        };

        const imageUrl = await uploadStream();

        await this.userModel.findByIdAndUpdate(req.params.id, {
          photo: imageUrl,
        });

        res.status(200).json({
          message: "Upload thành công!",
          status: "success",
          data: { photo: imageUrl },
        });
      } catch (err) {
        return next(new AppError("Something went wrong!", 500));
      }
    });
  }
}
export default UserRepository;
