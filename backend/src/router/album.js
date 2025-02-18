import { Router } from "express";
const router = Router();
import {
  addAlbum,
  getAllAlbums,
  deleteAlbumById,
  updateAlbumById,
  getAlbumById,
  getAlbumsByRestaurant,
} from "../controllers/albumController.js";
import multer from "multer";
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/getAllAlbums", getAllAlbums);
router.post("/addAlbum", upload.single("image"), addAlbum);
router.delete("/deleteAlbum/:id", deleteAlbumById);
router.patch("/updateAlbum/:id", updateAlbumById);
router.get("/getAlbum/:id", getAlbumById);
router.get("/getAlbumsByRestaurant/:restaurantId", getAlbumsByRestaurant);

export default router;
