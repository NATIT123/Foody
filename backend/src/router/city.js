import { Router } from "express";
const router = Router();
import {
  addCity,
  getAllCitys,
  updateCityById,
  getCityById,
  deleteCityById,
} from "../controllers/cityController.js";
import { protect } from "../controllers/authController.js";

router.get("/getAllCity", getAllCitys);

router.use(protect);
router.post("/addCity", addCity);
router.delete("/deleteCity/:id", deleteCityById);
router.patch("/updateCity/:id", updateCityById);
router.get("/getCity/:id", getCityById);

export default router;
