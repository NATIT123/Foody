import { Router } from "express";
const router = Router();
import {
  addDistrict,
  getAllDistricts,
  updateDistrictById,
  getDistrictById,
  deleteDistrictById,
  getDistrictsByCity,
} from "../controllers/districtController.js";
import { protect } from "../controllers/authController.js";

router.get("/getAllDistrict", getAllDistricts);
router.get("/getDistrictsByCity/:cityId", getDistrictsByCity);

router.use(protect);
router.post("/addDistrict", addDistrict);
router.delete("/deleteDistrict/:id", deleteDistrictById);
router.patch("/updateDistrict/:id", updateDistrictById);
router.get("/getDistrict/:id", getDistrictById);

export default router;
