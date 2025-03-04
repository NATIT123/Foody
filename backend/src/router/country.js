import { Router } from "express";
const router = Router();
import {
  addCountry,
  getAllCountrys,
  updateCountryById,
  getCountryById,
  deleteCountryById,
} from "../controllers/countryController.js";
import { protect } from "../controllers/authController.js";

router.get("/getAllCountry", getAllCountrys);
router.use(protect);
router.post("/addCountry", addCountry);
router.delete("/deleteCountry/:id", deleteCountryById);
router.patch("/updateCountry/:id", updateCountryById);
router.get("/getCountry/:id", getCountryById);

export default router;
