import { Router } from "express";
const router = Router();
import {
  addCollection,
  getAllCollections,
  deleteCollectionById,
  updateCollectionById,
  getCollectionById,
} from "../controllers/collectionController.js";

router.get("/getAllCollections", getAllCollections);
router.post("/addCollection", addCollection);
router.delete("/deleteCollection/:id", deleteCollectionById);
router.patch("/updateCollection/:id", updateCollectionById);
router.get("/getCollection/:id", getCollectionById);

export default router;
