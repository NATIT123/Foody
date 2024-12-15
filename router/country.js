import { Router } from "express";
const router = Router();
import {
  addCountry,
  getAllCountrys,
  updateCountryById,
  getCountryById,
  deleteCountryById,
} from "../controllers/countryController.js";

router.get("/getAllAlbums", getAllCountrys);
router.post("/addAlbum", addCountry);
router.delete("/deleteAlbum/:id", deleteCountryById);
router.patch("/updateAlbum/:id", updateCountryById);
router.get("/getAlbum/:id", getCountryById);

export default router;
