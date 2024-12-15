import { Router } from "express";
const router = Router();
import {
  addDistrict,
  getAllDistricts,
  updateDistrictById,
  getDistrictById,
  deleteDistrictById,
} from "../controllers/districtController.js";

router.get("/getAllDistrict", getAllDistricts);
router.post("/addDistrict", addDistrict);
router.delete("/deleteDistrict/:id", deleteDistrictById);
router.patch("/updateDistrict/:id", updateDistrictById);
router.get("/getDistrict/:id", getDistrictById);

export default router;
