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

router.get("/getAllAlbums", getAllAlbums);
router.post("/addAlbum", addAlbum);
router.delete("/deleteAlbum/:id", deleteAlbumById);
router.patch("/updateAlbum/:id", updateAlbumById);
router.get("/getAlbum/:id", getAlbumById);
router.get("/getAlbumsByRestaurant/:restaurantId", getAlbumsByRestaurant);

export default router;
