import { Router } from "express";
import { getAllBanks } from "../controllers/bankController.js";
const router = Router();

router.get("/getAllBanks", getAllBanks);
export default router;
