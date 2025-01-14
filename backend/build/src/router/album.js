import { Router } from "express";
var router = Router();
import { addAlbum, getAllAlbums, deleteAlbumById, updateAlbumById, getAlbumById } from "../controllers/albumController.js";
router.get("/getAllAlbums", getAllAlbums);
router.post("/addAlbum", addAlbum);
router["delete"]("/deleteAlbum/:id", deleteAlbumById);
router.patch("/updateAlbum/:id", updateAlbumById);
router.get("/getAlbum/:id", getAlbumById);
export default router;