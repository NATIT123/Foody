import { Router } from "express";
const router = Router();
import {
  addCoordinate,
  getAllCoordinates,
  deleteCoordinateById,
  updateCoordinateById,
  getCoordinateById,
} from "../controllers/coordinateController.js";

router.get("/getAllCoordinates", getAllCoordinates);
router.post("/addCoordinate", addCoordinate);
router.delete("/deleteCoordinate/:id", deleteCoordinateById);
router.patch("/updateCoordinate/:id", updateCoordinateById);
router.get("/getCoordinate/:id", getCoordinateById);

export default router;
